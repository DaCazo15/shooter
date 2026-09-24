/**
 * Script de migración de colecciones globales a subcolecciones por negocio
 *
 * Transfiere:
 *   - catalogo/        -> negocios/{uid}/catalogo/
 *   - inventario/      -> negocios/{uid}/inventario/
 *   - clientes/        -> negocios/{uid}/clientes/      (opcional)
 *   - proveedores/     -> negocios/{uid}/proveedores/   (opcional)
 *
 * Uso:
 *   1. Instala firebase-admin si no lo tienes:
 *      npm install -D firebase-admin
 *   2. Coloca tu archivo de credenciales 'serviceAccountKey.json' en la raíz del proyecto.
 *   3. Ejecuta en modo simulación (Dry Run):
 *      node scripts/migrate-to-subcollections.js --dry-run
 *   4. Ejecuta la migración real:
 *      node scripts/migrate-to-subcollections.js
 *   5. (Opcional) Borrar los originales de las colecciones globales tras migrar:
 *      node scripts/migrate-to-subcollections.js --delete-old
 */

import readline from 'readline'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import admin from 'firebase-admin'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Argumentos CLI
const args = process.argv.slice(2)
const isDryRun = args.includes('--dry-run')
const deleteOld = args.includes('--delete-old')
const defaultUidArg = args.find(a => a.startsWith('--default-uid='))?.split('=')[1]

// Configuración de credenciales de Firebase Admin
const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json')

if (!admin.apps.length) {
  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'))
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    })
    console.log('✅ Firebase Admin inicializado con serviceAccountKey.json')
  } else if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault()
    })
    console.log('✅ Firebase Admin inicializado con GOOGLE_APPLICATION_CREDENTIALS')
  } else {
    console.error('❌ Error: No se encontró serviceAccountKey.json en la raíz ni GOOGLE_APPLICATION_CREDENTIALS.')
    console.log('👉 Descarga la clave de servicio desde: Firebase Console > Configuración del Proyecto > Cuentas de Servicio')
    process.exit(1)
  }
}

const db = admin.firestore()

// Helper interactivo para preguntas en consola
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})
const askQuestion = (query) => new Promise((resolve) => rl.question(query, resolve))

// Caché de asignación de propietarios para no preguntar repetidamente
const userAssignmentCache = {}

/**
 * Determina a qué UID pertenece un documento
 */
async function resolveOwnerUid(docData, docId, collectionName) {
  // 1. Si ya tiene campo de propietario explícito
  const existingUid = docData.propietarioId || docData.uid || docData.userId || docData.negocioId
  if (existingUid) {
    return existingUid
  }

  // 2. Si se pasó por argumento CLI
  if (defaultUidArg) {
    return defaultUidArg
  }

  // 3. Preguntar al usuario por consola
  const promptKey = `${collectionName}_${docData.nombre || docData.titulo || docId}`
  if (userAssignmentCache[promptKey]) {
    return userAssignmentCache[promptKey]
  }

  console.log(`\n⚠️  Documento sin propietario en [${collectionName}]:`)
  console.log(`   ID: ${docId}`)
  console.log(`   Detalle:`, JSON.stringify(docData, null, 2).slice(0, 200) + '...')

  const ans = await askQuestion(`   👉 Ingresa el UID del negocio para este documento (o 'demo-user-1'): `)
  const resolved = ans.trim() || 'demo-user-1'
  userAssignmentCache[promptKey] = resolved
  return resolved
}

/**
 * Migra una colección global completa
 */
async function migrateCollection(collectionName) {
  console.log(`\n==================================================`)
  console.log(`📦 Procesando colección global: [${collectionName}]`)
  console.log(`==================================================`)

  const snapshot = await db.collection(collectionName).get()

  if (snapshot.empty) {
    console.log(`ℹ️  No hay documentos en la colección global '${collectionName}'.`)
    return { count: 0, byOwner: {} }
  }

  console.log(`🔍 Se encontraron ${snapshot.docs.length} documentos para migrar.`)

  let count = 0
  const byOwner = {}
  const batchSize = 400
  let batch = db.batch()
  let batchOps = 0

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data()
    const docId = docSnap.id
    const targetUid = await resolveOwnerUid(data, docId, collectionName)

    if (!byOwner[targetUid]) byOwner[targetUid] = 0
    byOwner[targetUid]++

    const targetDocRef = db
      .collection('negocios')
      .doc(targetUid)
      .collection(collectionName)
      .doc(docId)

    const payloadToSave = {
      ...data,
      propietarioId: targetUid,
      migradoEn: admin.firestore.FieldValue.serverTimestamp()
    }

    if (!isDryRun) {
      batch.set(targetDocRef, payloadToSave, { merge: true })
      batchOps++

      if (deleteOld) {
        batch.delete(docSnap.ref)
        batchOps++
      }

      if (batchOps >= batchSize) {
        await batch.commit()
        batch = db.batch()
        batchOps = 0
      }
    }

    count++
    console.log(`   ➡️  ${collectionName}/${docId} => negocios/${targetUid}/${collectionName}/${docId}`)
  }

  if (!isDryRun && batchOps > 0) {
    await batch.commit()
  }

  return { count, byOwner }
}

async function main() {
  console.log(`🚀 Iniciando Script de Migración a Subcolecciones Multi-Negocio`)
  if (isDryRun) {
    console.log(`🧪 [MODO DRY-RUN ACTIVO]: No se escribirán cambios reales en la base de datos.`)
  }
  if (deleteOld) {
    console.log(`🗑️  [DELETE-OLD ACTIVO]: Los documentos globales se eliminarán tras la copia.`)
  }

  const coleccionesAMigrar = ['catalogo', 'inventario', 'clientes', 'proveedores']
  const resumenGlobal = {}

  for (const col of coleccionesAMigrar) {
    resumenGlobal[col] = await migrateCollection(col)
  }

  console.log(`\n==================================================`)
  console.log(`📊 RESUMEN FINAL DE LA MIGRACIÓN`)
  console.log(`==================================================`)

  for (const [col, info] of Object.entries(resumenGlobal)) {
    console.log(`\n📁 Colección [${col}]: ${info.count} documentos`)
    for (const [uid, cant] of Object.entries(info.byOwner)) {
      console.log(`   👤 Negocio [${uid}]: ${cant} items`)
    }
  }

  console.log(`\n✅ Proceso finalizado exitosamente.`)
  rl.close()
}

main().catch((err) => {
  console.error('❌ Error durante la migración:', err)
  rl.close()
  process.exit(1)
})
