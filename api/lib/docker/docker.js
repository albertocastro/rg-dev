import exec from "await-exec";
import { spawn, execSync as execSync } from "child_process";
const containerPrefix = "rgcontainer_";

export const STATUS = {
  RUNNING: "RUNNING",
  PAUSED: "PAUSED",
};
export const start = async (server, customerId) => {
  const containerName = `${containerPrefix}${server}_${customerId}`;
  await removeContainerIfExists(containerName);
  const containerId = (await exec(
    `docker run -d -ti -p 22:22 -p 80:80 -p 3306:3306 --name ${containerName} -v ~/projects/rg/record-guardian/internals/:/internals -v ~/projects/rg/record-guardian/app/:/var/www/html/9999999997 rgimage /internals/start.sh`
  )).stdout;
  await init(containerName, server, customerId);
  return containerId
};
export const init = async (containerName, server, customerId) => {
  console.log("Starting Init ", containerName);
  const result = await execInContainer(
    containerName,
    `/internals/init.sh ${server} ${customerId}`
  );
  console.log("DoneInit ");
  return result;
  // const process = spawn(`docker`,["exec", containerName ,`/internals/init.sh`, server,customerId])

  // process.stdout.on("data",data=>{
  //     console.log(data.toString())
  // })
  // process.stderr.on("data",data=>{
  //     console.log(data.toString())
  // })
  // process.on("error",error=>{
  //     console.log("ERROR ",error)
  // })
};
export const removeContainerIfExists = async (containerName) => {
  const containerId = (await exec(`docker ps -a -q -f name="${containerName}"`))
    .stdout;

  if (containerId) {
    console.log("containerId", containerId);
    await exec(`docker rm ${containerId}`);
  } else {
    console.log("No container found");
  }
};
export const removeContainer = async (containerId) => {
  return (await exec(`docker rm ${containerId}`)) || null;
};
export const stopContainers = async () => {
  console.log("Stopping Containers");
  const containersList = (await exec("docker ps -aq")).stdout.split("\n");

  if (containersList) {
    for (const elem of containersList) {
      if (elem) {
        await exec(`docker stop  ${elem}`);
      }
    }
  }
};
export const stopContainer = async (containerId) => {
  console.log("Stopping Container");

  return await exec(`docker stop ${containerId}`);
};
export const startContainer = async (containerId) => {
  console.log("Start Container ".containerID);

  return await exec(`docker start ${containerId}`);
};
export const execInContainer = async (container, command) => {
  console.log(`docker exec ${container} ${command}`);
  const commands = ["exec", container, ...command.split(" ")];
  await execSync(`docker exec ${container} ${command}`, { stdio: "inherit" });

  // await Promise.resolve(()=>{
  //     const process = spawn(`docker`,commands)

  //     process.stdout.on("data",data=>{
  //         console.log(data.toString())
  //     })
  //     process.stderr.on("data",data=>{
  //         console.log(data.toString())
  //     })
  //     process.on("error",error=>{
  //         console.log("ERROR ",error)
  //     })
  // })
  return true;
};
export const getCurrentContainer = async () => {
  const containerName = (
    await exec(`docker ps -q -f name="rgcontainer_*"`)
  ).stdout.trim();
  return containerName ? containerName : null;
};
export const getAllContainers = async () => {
  const containersName = (
    await exec(`docker ps -a -q -f name="rgcontainer_*"`)
  ).stdout
    .trim()
    .split("\n");
  return containersName;
};
export const getContainers = async (filter) => {
  const containersName = (
    await exec(`docker ps -a -q -f name="${filter}"`)
  ).stdout
    .trim()
    .split("\n");
  return containersName;
};
export const getRunningContainers = async (filter) => {
  const containersName = (
    await exec(`docker ps -a -q -f name="${filter}" -f status="running"`)
  ).stdout
    .trim()
    .split("\n");
  return containersName;
};
export const getPausedContainers = async (filter) => {
  const containersName = (
    await exec(`docker ps -a -q -f name="${filter}" -f status="paused"`)
  ).stdout
    .trim()
    .split("\n");
  return containersName;
};
export const getRunningContainersWithName = async (filter) => {
  const containersName = (
    await exec(
      `docker ps -a -q -f name="${filter}" -f status="running" --format "{{.ID}} |  {{.Names}}" `
    )
  ).stdout
    .trim()
    .split("\n");
  return containersName;
};
export const getPausedContainersWithName = async (filter) => {
  const containersName = (
    await exec(
      `docker ps -a -q -f name="${filter}" -f status="paused" --format "{{.ID}} |  {{.Names}}" `
    )
  ).stdout
    .trim()
    .split("\n");
  return containersName;
};
export const getContainersWithName = async (filter) => {
  const containersName = (
    await exec(
      `docker ps -a -q -f name="${filter}" --format "{{.ID}} |  {{.Names}} | {{.Status}}" `
    )
  ).stdout
    .trim()
    .split("\n");
  return containersName;
};
