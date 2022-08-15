import * as admin from 'firebase-admin'
import { getFirestore } from 'firebase-admin/firestore'
import type { NextApiRequest, NextApiResponse } from 'next'
const cache = require('memory-cache');

export type PoeBuild = {
  build_name : string
  ascendancy : string
  build_link : string
  class_name : string
  source : string
  version: string
}

const serviceAccount = JSON.parse(
  process.env.FIREBASE_SERVICE_ACCOUNT_KEY as string
)

if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


const selectOneFromAll = (builds: PoeBuild[]) =>  {
  return builds[Math.floor(Math.random()*builds.length)];
}

const selectOneFromClass = (builds: PoeBuild[], className: string, ascendancy: string) =>  {
  const filterBuilds = builds
  .filter(build => build.class_name === className )
  .filter(build => {
    if (!ascendancy || ascendancy === "ALL") {
      return true;
    }

    return build.ascendancy === ascendancy
  })

  if (filterBuilds.length > 0) {
    return filterBuilds[Math.floor(Math.random()*filterBuilds.length)];
  } else {
    return {} as PoeBuild
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PoeBuild>
): Promise<void> {
  const db = getFirestore();

  const buildCache = cache.get("builds");

  let builds : PoeBuild[] = []
  if (buildCache) {
    builds = buildCache 
  } else {
    const buildCollections = db.collection('poe-next-builds');
    const snapshot = await buildCollections.get();
  
    snapshot.forEach( (document) => {
      const data = document.data()
  
      builds.push({
        build_name: data["build_name"],
        ascendancy: data["ascendancy"],
        build_link: data["build_link"],
        source: data["source"],
        class_name: data["class_name"],
        version: data["version"]
      });
    });

    
    const expire10hourse = 1000*30*600;
    cache.put("builds", builds, expire10hourse);
  }

  const className = req.query["class_name"] as string;
  const ascendancy = req.query["ascendancy"] as string;

  let selectedBuild;
  if (!className || className === "ALL") {
    selectedBuild = selectOneFromAll(builds);
  } else {
    selectedBuild = selectOneFromClass(builds, className, ascendancy);
  }

  res.status(200).json(selectedBuild)
}

