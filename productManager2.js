const { log } = require("console");
const fs = require("fs");
const { json } = require("stream/consumers");
let pathFile = "./products.JSON";
/* Creo la clase */

class ProductManager {
  constructor() {
    this.products = [];
  }

  /* Metodos */

  /* Muestro todos los productos */
  async getProducts() {
    const productJson = await fs.promises.readFile(pathFile, "utf8"); //Leo el archivo
    this.products = JSON.parse(productJson); //Transformo el .JSON de string a objt
    console.log(`--Funcion getProducts---`, this.products);

    return this.products;
  }

  /*Metodo agregar productos al array y creacion del JSON*/
  async addProduct(title, description, price, thumbnail, code, stock) {
    const id = this.products.length + 1;

    const newProducts = {
      id,
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    /* Validacion de datos */
    if (Object.values(newProducts).includes(undefined)) {
      return console.log(`Los datos del producto estan incompletos`);
    } else {
      /* Validacion del campo "Code" */
      const codeExists = this.products.filter(
        (codeExists) => codeExists.code === code
      );

      if (codeExists == false) {
        this.products.push(newProducts); //Pusheo al array los productos

        await fs.promises.writeFile(pathFile, JSON.stringify(this.products)); //Agrego al JSON los productos
      } else {
        //
        console.log(`El codigo del producto "${newProducts.code}" ya existe`);
        return;
      }
    }
  }

  /* Metodo buscar producto por ID */
  async getProductById(id) {
    const productJson = await fs.promises.readFile(pathFile, "utf8"); //Leo el archivo
    this.products = JSON.parse(productJson); //Transformo el .JSON de string a objt

    const IdExists = this.products.filter((ProductId) => ProductId.id === id);
    if (IdExists) {
      return console.log(
        `Producto Encontrado por ID ${id}`,
        this.products[id - 1]
      );
    } else {
      return console.log("No existe el producto con este ID");
    }
  }

  //Metodo modificar producto por ID

  async updateProduct(id, fieldData) {
    const productJson = await fs.promises.readFile(pathFile, "utf8"); //Leo el archivo
    this.products = JSON.parse(productJson); //Transformo el .JSON de string a objt
    const index = this.products.findIndex((prod) => prod.id === id); //busco el id del objeto pasado por parametro

    this.products[index] = { ...this.products[index], ...fieldData }; //Creo una copia de mi objeto modificando los campos pasados por parametro
    await fs.promises.writeFile(pathFile, JSON.stringify(this.products)); //Sobreescribo el archivo
  }

  //Metodo Eliminar producto

  async deleteProduct(id) {
    const productJson = await fs.promises.readFile(pathFile, "utf8"); //Leo el archivo
    this.products = JSON.parse(productJson); //Transformo el .JSON de string a objt
    const filterId = this.products.filter((product) => product.id !== id); //Aplico metodo filter para que me devueva el array sin el producto pasando por parametro el ID

    await fs.promises.writeFile(pathFile, JSON.stringify(filterId)); //Sobreescribo el archivo
  }
}

//--------PRUEBAS--------//
const Manager = new ProductManager();
console.log(
  Manager.addProduct("Telefono", "Samsung", "www.google.com", 20, "L01", 20)
);
console.log(
  Manager.addProduct("Libro", "Historia", 10, "www.mercadolibre.com", "L02", 15)
);
console.log(
  Manager.addProduct("Teclado", "Perifericos", 30, "www.google.com", "L03", 5)
);

/* Prueba para validacion de CODE no se  muestra  */
console.log(
  Manager.addProduct("Escuadra", "Matematica", 40, "www.facebook.com", "L03", 2)
);
/* Muestro todos los productos */
console.log(Manager.getProducts());
/* Busco los productos por ID */
console.log(Manager.getProductById(2));

/*Modifico campo de un producto por ID */
// console.log("Update Products");
console.log(Manager.updateProduct(1, { title: "Movil", description: "Nokia" }));

console.log(Manager.deleteProduct(2));
