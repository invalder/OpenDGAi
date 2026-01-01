import { onSchedule } from "firebase-functions/v2/scheduler";
import * as admin from "firebase-admin";
import axios from "axios";

// Interface for CKAN dataset response
interface CKANResponse {
    success: boolean;
    result: {
        results: any[];
    }
}

const CKAN_URL = "https://data.go.th"; // Default, could be config

export const syncCKAN = onSchedule("every 24 hours", async (event) => {
    console.log("Starting CKAN Sync...");

    try {
        const response = await axios.get<CKANResponse>(`${CKAN_URL}/api/3/action/package_search?q=&rows=100`); // Sync top 100 for now

        if (!response.data.success) {
            console.error("CKAN API failed");
            return;
        }

        const datasets = response.data.result.results;
        const batch = admin.firestore().batch();
        let count = 0;

        for (const item of datasets) {
            // Check if exists
            const existing = await admin.firestore().collection('datasets')
                .where('ckanId', '==', item.id)
                .limit(1)
                .get();

            if (!existing.empty) {
                // Update
                const docRef = existing.docs[0].ref;
                batch.update(docRef, {
                    title: item.title,
                    description: item.notes,
                    updatedAt: new Date().toISOString(),
                    lastSynced: new Date().toISOString(),
                    // Optionally update resources/url if changed
                });
            } else {
                // Create new
                // Simplified mapping for background sync
                const resource = item.resources.find((r: any) =>
                    ['csv', 'json', 'xml'].includes(r.format.toLowerCase())
                );

                if (resource) { // Only sync if valid resource found
                    const newDocRef = admin.firestore().collection('datasets').doc();
                    batch.set(newDocRef, {
                        title: item.title,
                        description: item.notes,
                        ckanId: item.id,
                        ckanUrl: CKAN_URL,
                        fileUrl: resource.url,
                        format: resource.format.toLowerCase(),
                        owner: 'system', // or specific bot user
                        visibility: 'public',
                        pdpaStatus: 'pending',
                        createdAt: new Date().toISOString(),
                        updatedAt: new Date().toISOString(),
                        lastSynced: new Date().toISOString(),
                        metadata: {
                            publisher: item.organization?.title,
                            issued: item.metadata_created,
                            modified: item.metadata_modified,
                            license: item.license_title,
                            keywords: item.tags?.map((t: any) => t.name) || [],
                        }
                    });
                }
            }
            count++;
             // Batches are limited to 500 ops
             if (count >= 400) break;
        }

        await batch.commit();
        console.log(`Synced ${count} datasets from CKAN.`);

    } catch (error) {
        console.error("Error syncing CKAN:", error);
    }
});
