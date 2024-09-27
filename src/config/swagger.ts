import swaggerJSDoc from "swagger-jsdoc";
import { SwaggerUiOptions } from "swagger-ui-express";

const options: swaggerJSDoc.Options = {
    swaggerDefinition: {
        openapi: '3.0.2',
        tags: [
            {
                name: 'Products',
                description: 'API operations related to products'
            }
        ],
        info: {
            title: 'REST API Node.js / Express / TypeScript',
            version: '1.0.0',
            description: 'API Docs for Products'
        }
    },
    apis: ['./src/router.ts']
}

const swaggerSpec = swaggerJSDoc(options)

const swaggerUiOptions: SwaggerUiOptions = {
    customCss: `
        .topbar-wrapper .link {
            content: url('https://freesvg.org/img/Guinea-Pig-Illustration.png');
            display: inline-block;
            position: absolute;
            top: 10px;
            max-height: 80px;
            width: auto;
        }
        .swagger-ui .topbar {
            background-color: #2b3b45;
            padding: 50px;
        }
    `,
    customSiteTitle: 'Documentación REST API Express / TypeScript'
}

export default swaggerSpec
export {
    swaggerUiOptions
}