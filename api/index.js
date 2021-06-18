import express from "express"
import {
    startAccount,
    downloadFiles,
    stopAllContainers,
    removeAllContainers,
    init,
    getState,
    resumeContainer,
    stopContainer
} from "./lib/rgdocker/rgdocker.js"
import cors from "cors"
const port = 4200
const app = express()
app.use(cors())
init()
app.get('/start/:server/:account', async (req, res) => {
    const {server,account} = req.params
    const result = await startAccount(server,account)
    res.send(result)
})
app.get('/stop/:containerId', async (req, res) => {
    const {containerId} = req.params
    const result = await stopContainer(containerId)
    res.send(result)
})
app.get('/files/:server/:account/:docid', async (req, res) => {
    const {server,account,docid} = req.params
    const response = await downloadFiles(server,account,docid)
    res.send(response)
})
app.get('/stop', async (req, res) => {
    
    const response = await stopAllContainers()
    res.send(response)
})
app.get('/remove', async (req, res) => {
    
    const response = await removeAllContainers()
    res.send(response)
})
app.get('/init', async (req, res) => {
    
    const state = await init();
    res.send(state)
})
app.get('/state', async (req, res) => {
    
    const state = await getState();
    res.send(state)
})
app.get('/resume/:containerId', async (req, res) => {
    const {containerId} = req.params

    await resumeContainer(containerId)
    const state = await getState();
    res.send(state)
})
app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})