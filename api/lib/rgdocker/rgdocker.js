import {
  start,
  stopContainers,
  execInContainer,
  getAllContainers,
  removeContainer,
  getCurrentContainer,
  getContainersWithName,
  getPausedContainersWithName,
  getContainers,
  startContainer as startDockerContainer,
  stopContainer as stopDockerContainer,
  STATUS,
} from "../docker/docker.js";
import Datastore from "nedb";
const db = new Datastore({ filename: "rgadmin", autoload: true });
export const startAccount = async (server, customerId) => {
  console.log(`Starting Account ${server} ${customerId}`);
  await stopContainers();
  const containerId = await start(server, customerId);
    await (new Promise((resolve)=>{
        db.insert({
            server,companyId:customerId,
            status:STATUS.RUNNING,
            containerId
        },()=>{resolve()})
    }))
  const state = await getState()
  return state
};
export const stopContainer = async (containerId) =>{
    console.log("Stopping ",containerId)
    await stopDockerContainer(containerId)
    await (new Promise((resolve)=>{
        db.update({ containerId: containerId},{ $set: { status: STATUS.PAUSED } },()=>{resolve()})
    }))
    return await getState()
}
export const resumeContainer= async (containerId) =>{
    console.log("Resuming ",containerId)
    await startDockerContainer(containerId)
    await (new Promise((resolve)=>{
        db.update({ containerId: containerId},{ $set: { status: STATUS.RUNNING } },()=>{resolve()})
    }))
    return await getState()
}
export const downloadFiles = async (server, customerId, docid) => {
  const year = docid.substring(0, 4);
  const month = docid.substring(4, 6);

  console.log(year);
  console.log(month);
  console.log(docid);
  const containerName = await getCurrentContainer();

  if (!containerName) return null;

  return await execInContainer(
    containerName,
    `/internals/getFilesOfFolder.sh ${server} ${customerId} ${year} ${month} ${docid}`
  );
};
export const stopAllContainers = async () => {
  return await stopContainers();
};
export const removeAllContainers = async () => {
  await stopAllContainers();
  const containers = await getAllContainers();
  for (const container of containers) {
    await removeContainer(container);
  }
  return containers;
};
const dockerNameToObj = (name) => ({
  containerId: name.split("|")[0].trim(),
  server: name.split("|")[1].split("_")[1].trim(),
  companyId: name.split("|")[1].split("_")[2].trim(),
  status: name.split("|")[2].includes("Up") ? STATUS.RUNNING : STATUS.PAUSED,
});
export const init = async () => {
  db.remove({}, { multi: true },(err,num)=>{
      console.log(err,num)
  })
  const containers = (await getContainersWithName("rgcontainer*")).map((c) =>
    dockerNameToObj(c)
  );
  db.insert(containers);
  const containersFromDb = await (new Promise((resolve)=>{
      db.find({},(err,docs)=>{
      resolve(docs)
  })}))

  return containersFromDb;
};
export const getState =async ()=>{
    return  await (new Promise((resolve)=>{
        db.find({},(err,docs)=>{
        resolve(docs)
    })}))
  
}
export default "test";
