import { onCall, HttpsError } from "firebase-functions/v2/https";
import * as admin from "firebase-admin";
import { scanForPII } from "./services/piiDetection";

admin.initializeApp();

export const scanDataset = onCall(async (request) => {
  if (!request.auth) {
    throw new HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { datasetId, data } = request.data;

  if (!datasetId || !data) {
    throw new HttpsError('invalid-argument', 'The function must be called with a datasetId and data.');
  }

  try {
    const result = await scanForPII(data);

    // Save result to Firestore
    await admin.firestore().collection('scans').add({
        datasetId,
        riskScore: result.riskScore,
        findings: result.findings,
        status: 'completed',
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        createdBy: request.auth.uid
    });

    // Update dataset status
    await admin.firestore().collection('datasets').doc(datasetId).update({
        pdpaStatus: result.riskScore > 50 ? 'high_risk' : 'compliant', // Simple rule
        lastScanDate: admin.firestore.FieldValue.serverTimestamp()
    });

    return result;
  } catch (error) {
    console.error('Error scanning dataset:', error);
    throw new HttpsError('internal', 'Unable to scan dataset.');
  }
});
