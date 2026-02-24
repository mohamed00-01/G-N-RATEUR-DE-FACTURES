let products = []; 
let totalHT = 0;


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
    tbody.innerHTML = ""; 
    totalHT = 0; 



    products.forEach((item, index) => { 
        totalHT += item.total;   
        

        const row = ` 
        <tr>
            <td>${item.product}</td>
            <td>${item.quantity}</td>
            <td>${item.price}</td>
            <td>${item.total.toFixed(2)}</td>
            <td><button onclick="deleteProduct(${index})">X</button></td>
        </tr>
        `;

        tbody.innerHTML += row; 
    });
}


function deleteProduct(index) {
    products.splice(index, 1);
    renderTable();
    updateTotals();
    saveToLocalStorage();
}

function updateTotals() {  
    const rate = document.getElementById("tvaRate").value / 100;
    const tva = totalHT * rate;
    const totalTTC = totalHT + tva;

    document.getElementById("totalHT").innerText = totalHT.toFixed(2); 
    document.getElementById("tva").innerText = tva.toFixed(2);
    document.getElementById("totalTTC").innerText = totalTTC.toFixed(2);
}


function saveToLocalStorage() { 
    localStorage.setItem("products", JSON.stringify(products));
    

}  



function loadFromLocalStorage() {
    const data = localStorage.getItem("products");
    
    
    if (data) {     
        products = JSON.parse(data);  
         
        renderTable();   
        updateTotals();
    }
} 

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