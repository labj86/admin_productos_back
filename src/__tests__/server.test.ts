import { connectDB } from '../server'
import db from '../config/db'

// describe('GET /api', () => {
//     let res: request.Response

//     beforeAll(async () => {
//         res = await request(server).get('/api')
//     })

//     test('200 status code', async () => {
//         expect(res.status).toBe(200)
//         expect(res.status).not.toBe(404)
//         //console.log(res)
//     })

//     test('json response', async () => {
//         expect(res.headers['content-type']).toMatch(/json/)
//     })

//     test('message', async () => {
//         expect(res.body.msg).toBe('Desde API')
//         expect(res.body.msg).not.toBe('')
//     })
// })


describe('connectDB', () => {
    jest.mock('../config/db')
    test('handle DB connection error', async () => {
        jest.spyOn(db, 'authenticate')
            .mockRejectedValueOnce(new Error('Error forzado'))
        
        const consoleSpy = jest.spyOn(console, 'log')

        await connectDB()

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Hubo un error al conectar a la BD')
        )
    })
})