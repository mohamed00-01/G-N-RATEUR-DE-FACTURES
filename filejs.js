let products = []; // Tableau pour stocker les produits ajoutés
let totalHT = 0;

// Génération numéro facture
document.getElementById("invoiceNumber").innerText =
    Math.floor(Math.random() * 100000);

document.getElementById("date").innerText =
    new Date().toLocaleDateString();


function addProduct() {

    const product = document.getElementById("product").value;
    const quantity = parseFloat(document.getElementById("quantity").value);
    const price = parseFloat(document.getElementById("price").value);

    if (!product || quantity <= 0 || price <= 0) {
        alert("Champs invalides");
        return;
    }

    const total = quantity * price;

    products.push({product, quantity, price, total});
    renderTable();
    updateTotals();

    saveToLocalStorage();
}


function renderTable() {

    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = ""; //On vide le tableau. sinon, à chaque ajout de produit,
                         //les anciennes lignes resteraient affichées en double.
    totalHT = 0; 



    products.forEach((item, index) => { //On parcourt le tableau products.
        totalHT += item.total;    //recalcule le total complet apres avoir initialiser le 
        // tebleau product a zero .   //index , position utile pour supprimer // item : produit actuel

        const row = ` 
        <tr>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.total.toFixed(2)}</td>
            <td><button onclick="deleteProduct(${index})">X</button></td>
        </tr>
        `; //Ici on crée une ligne HTML dynamiquement.

        tbody.innerHTML += row; //On ajoute la ligne au tableau.
    });
}


function deleteProduct(index) {
    products.splice(index, 1);
    renderTable();
    updateTotals();
    saveToLocalStorage();
}

function updateTotals() {   //espace de calcul 
    const rate = document.getElementById("tvaRate").value / 100;
    const tva = totalHT * rate;
    const totalTTC = totalHT + tva;

    document.getElementById("totalHT").innerText = totalHT.toFixed(2); //<-- modifie les valeur
    document.getElementById("tva").innerText = tva.toFixed(2);
    document.getElementById("totalTTC").innerText = totalTTC.toFixed(2);
}


function saveToLocalStorage() { //C’est un espace de stockage intégré au navigateur.
    localStorage.setItem("products", JSON.stringify(products));
    //mon navigateur a un espace de stockage local appelé localStorage,
    //  qui permet de stocker des données sous forme de paires clé - valeur.

}  //JSON.stringify() permet de convertir le tableau products en une chaîne de caractères JSON,
//  qui peut être stockée dans le localStorage.
//en gros mon tableau product est converti en une chaîne de caractères .

function loadFromLocalStorage() {
    const data = localStorage.getItem("products"); // je récupères la valeur stockée sous 
    // la clé "products".
    //Si rien n’a été sauvegardé, data sera null.
    if (data) {      //Tu vérifies que des données existent
        products = JSON.parse(data);   // reconvertis la chaîne JSON en vrai tableau JavaScript.
         // apre ca product devient un tableau exploitable .

         //Mise à jour de l’interface .
        renderTable();   
        updateTotals();
    }
} //Sinon, si tu actualises la page → tout disparaît .

loadFromLocalStorage();





async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    doc.text("FACTURE", 10, 10);
    doc.text("Client: " + document.getElementById("clientName").value, 10, 20);
    doc.text("Email: " + document.getElementById("clientEmail").value, 10, 30);

    let y = 40;
    products.forEach(item => {
        doc.text(`${item.product} : ${item.quantity} x ${item.price} = ${item.total}`, 10, y);
        y += 10;
    });

    doc.text("Total TTC: " + document.getElementById("totalTTC").innerText + " €", 10, y+10);

    doc.save("facture.pdf");
}