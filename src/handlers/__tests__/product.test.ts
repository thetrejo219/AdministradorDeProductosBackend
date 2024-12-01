import request  from "supertest";
import server from "../../server";


describe('Post /api/products',()=>{
    it('should display validation errors', async()=>{
        const response = await request(server).post('/api/products').send()
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errores')
        expect(response.body.errores).toHaveLength(4)

        expect(response.status).not.toEqual(404)
        expect(response.body.errores).not.toHaveLength(2)
    })
    it('should validate that the price is greater than 0', async()=>{
        const response = await request(server).post('/api/products').send({
            name:'Play station 5 ---prueba',
            price:0
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errores')
        expect(response.body.errores).toHaveLength(1)

        expect(response.status).not.toEqual(404)
        expect(response.body.errores).not.toHaveLength(2)
    })
    it('should validate that the price is a number and greater than 0', async()=>{
        const response = await request(server).post('/api/products').send({
            name:'Play station 5 ---prueba',
            price:"hola"
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errores')
        expect(response.body.errores).toHaveLength(2)

        expect(response.status).not.toEqual(404)
        expect(response.body.errores).not.toHaveLength(4)
    })
    it('should create a new product',async()=>{
        const response = await request(server).post('/api/products').send({
            name:'Mouse',
            price:50
        })
        expect(response.status).toBe(201)
        expect(response.body).toHaveProperty('data')
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('errors')
    })
})

describe('GET /Api/products',()=>{
    it('should check if api/products url exists',async()=>{
        const response = await request(server).get('/api/products')
        expect(response.status).not.toBe(404)
    })
    it('Get a json response with products', async()=>{
        const response = await request(server).get('/api/products')
        expect(response.status).toBe(200)
        expect(response.headers['content-type']).toMatch(/json/)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data).toHaveLength(1)
        expect(response.body).not.toHaveProperty('errores')
    })
})

describe('GET /api/products',()=>{
    // it('Should return a 404 response for a non-existent product',async()=>{
    //     const productId=200
    //     const response = await request(server).get(`/api/products/${productId}`)
    //     expect(response.status).toBe(404)
    //     expect(response.body).toHaveProperty('error')
    //     expect(response.body.errores).toBe('Producto no encontrado')
    // })
    it('should check a valid ID in the URL',async()=>{
        const response = await request(server).get('/api/products/not-valid-url')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errores')
        expect(response.body.errores).toHaveLength(1)
        expect(response.body.errores[0].msg).toBe('ID no valido')
    })
    it('should check a valid ID in the URL',async()=>{
        const response = await request(server).get('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        
    })
})

describe('PUT /api/products/:id',()=>{
    it('should check a valid ID in the URL',async()=>{
        const response = await request(server).put('/api/products/not-valid-url').send({
            name: "Monitor Curvo --actualizado",
            price: 300,
            availability: true
        })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errores')
        expect(response.body.errores).toHaveLength(1)
        expect(response.body.errores[0].msg).toBe('ID no valido')
    })
    it('should display validation error message when updating a products',async()=>{
        const response = await request(server).put('/api/products/1').send({})
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errores')
        expect(response.body.errores).toBeTruthy()
        expect(response.body.errores).toHaveLength(5)

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')

    })
    it('should validate that the price is greater than 0',async()=>{
        const response = await request(server).put('/api/products/1').send({
            name: "Monitor Curvo --actualizado",
            price: 0,
            availability: false
          })
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errores')
        expect(response.body.errores).toBeTruthy()
        expect(response.body.errores).toHaveLength(1)
        expect(response.body.errores[0].msg).toBe('Precio no valido')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')



    })
    it('should return a 404 response for a non-existent product',async()=>{
        const productID = 2000
        const response = await request(server).put(`/api/products/${productID}`).send({
            name: "Monitor Curvo --actualizado",
            price: 300,
            availability: true
          })
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')

        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')



    })
    it('should update an existing product with valid data',async()=>{
        
        const response = await request(server).put(`/api/products/1`).send({
            name: "Monitor Curvo --actualizado",
            price: 300,
            availability: true
          })
        
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')

        expect(response.status).not.toBe(404)
        expect(response.body).not.toHaveProperty('errores')



    })
})

describe('PATCH /api/products/:id',()=>{
    it('should return a 404 response for a non-existing product',async()=>{
        const productId = 2000
        const response  = await request(server).patch(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')
        expect(response.status).not.toBe(200)
        expect(response.body).not.toHaveProperty('data')
    })
    it('should update the product availability',async()=>{
        const response = await request(server).patch(`/api/products/1`)
        expect(response.status).toBe(200)
        expect(response.body).toHaveProperty('data')
        expect(response.body.data.availability).toBe(false)

        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
        expect(response.body).not.toHaveProperty('error')
    })
})


describe('DELETE /api/products:id',()=>{
    it('should check a valid ID',async()=>{
        const response = await request(server).delete('/api/products/not-valid')
        expect(response.status).toBe(400)
        expect(response.body).toHaveProperty('errores')
        expect(response.body.errores[0].msg).toBe('ID no valido')
    })
    it('should return a 404 response for a non-existent product',async()=>{
        const productId=2000
        const response = await request(server).delete(`/api/products/${productId}`)
        expect(response.status).toBe(404)
        expect(response.body.error).toBe('Producto no encontrado')
        expect(response.status).not.toBe(200)
    })
    it('should delete a product',async()=>{
        const response = await request(server).delete('/api/products/1')
        expect(response.status).toBe(200)
        expect(response.body.data).toBe("Producto eliminado")
        expect(response.status).not.toBe(404)
        expect(response.status).not.toBe(400)
    })
})