import request from 'supertest'
import server from '../server'

describe('POST /api/products - Create a new product', () => {
    
    it('should display validation errors', async()=> {
        const response = await request(server).post('/api/products').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(4)
    })

    it('should validate that the price is greater than 0', async()=> {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Curvo',
            price: 0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
    })

    it('should validate that the price is a number', async()=> {
        const response = await request(server).post('/api/products').send({
            name: 'Monitor Curvo',
            price: 'Hola'
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(2)
    })

    let res: request.Response

    beforeAll(async () => {
        res = await request(server).post('/api/products').send({
            name: "Mouse - Testing",
            price: 999
        })
    })

    test('status code: 201', () => {
        expect(res.status).toEqual(201)
    })

    test('data in response', () => {
        expect(res.body).toHaveProperty('data')
        expect(res.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products', () => {
    test('GET a JSON response with products', async() => {
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /api/products/:id', () => {
    test('404 response for a non-existent product', async() => {
        const productId = 2000
        const response = await request(server).get(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body).toHaveProperty('error')
        expect(response.body.error).toBe('Producto No Encontrado')
    })

    it('valid ID in the URL', async() => {
        const response = await request(server).get(`/api/products/not-valid-url`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    it('get a JSON response for a single product', async() => {
        const response = await request(server).get(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
    })
})

describe('PUT /api/products/:id', () => {
    test('sending and empty object', async() => {
        const response = await request(server).put(`/api/products/1`).send({})
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(5)
    })

    it('valid ID in the URL', async() => {
        const response = await request(server).put(`/api/products/not-valid-url`).send({
            name: "Monitor Curvo - Prueba",
            availability: true,
            price: 100
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    test('price greater than 0', async() => {
        const response = await request(server).put(`/api/products/1`).send({
            name: "Monitor Curvo - Prueba",
            availability: true,
            price: 0
        })
        expect(response.status).toBe(400)
        expect(response.body.errors).toBeTruthy()
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('Precio no válido')
    })

    test('404 response for a non-existent products', async() => {
        const productId = 1000
        const response = await request(server).put(`/api/products/${productId}`).send({
            name: "Monitor Curvo - Prueba",
            availability: true,
            price: 300
        })
        expect(response.status).toBe(404)
        expect(response.body.error).toBeTruthy()
        expect(response.body.error).toBe('Producto No Encontrado')
    })

    test('update an existing product with valid data', async() => {
        const response = await request(server).put(`/api/products/1`).send({
            name: "Monitor Curvo - Prueba",
            availability: true,
            price: 300
        })
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('PATCH /api/products/:id', () => {

    it('valid ID in the URL', async() => {
        const response = await request(server).patch(`/api/products/not-valid-url`)
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors).toHaveLength(1)
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    test('404 response for a non-existent products', async() => {
        const productId = 1000
        const response = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBeTruthy()
        expect(response.body.error).toBe('Producto No Encontrado')
        expect(response.body).not.toHaveProperty('data')
    })

    test('update an existing product availability', async() => {
        const response = await request(server).patch(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('DELETE /api/products/:id', () => {
    it('should check a valid ID', async () => {
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errors')
        expect(response.body.errors[0].msg).toBe('ID no válido')
    })

    test('404 response for a non-existing product', async () => {
        const productId = 2000
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto No Encontrado')
    })

    test('404 response for a non-existing product', async () => {
        const response = await request(server).delete(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body.data).toBe('Producto Eliminado')
    })
})