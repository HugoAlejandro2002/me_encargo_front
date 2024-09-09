

import React from 'react'
import jsPDF from 'jspdf'
import 'jspdf-autotable'

function showPDF() {
    // npm install jspdf jspdf-autotable
    const data = [
        {
          "producto": "Bolso circular Nike Negro con dorado",
          "unitartio": "130,00 Bs",
          "cantidad": "1",
          "total": "-130,00 Bs",
        },
        {
          "producto": "Bolso circular Nike Negro con dorado",
          "unitartio": "130,00 Bs",
          "cantidad": "1",
          "total": "-130,00 Bs",
        },
        {
          "producto": "Bolso circular Nike Negro con dorado",
          "unitartio": "130,00 Bs",
          "cantidad": "1",
          "total": "-130,00 Bs",
        },
        {
          "producto": "Bolso circular Nike Negro con dorado",
          "unitartio": "130,00 Bs",
          "cantidad": "1",
          "total": "-130,00 Bs",
        },
        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },
        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },        {
          "producto": "2 charms",
          "unitartio": "25,00 Bs",
          "cantidad": "2",
          "total": "50,00 Bs",
        },
        {
          "producto": "Dije",
          "unitartio": "40,00 Bs",
          "cantidad": "1",
          "total": "40,00 Bs",
        },
      ];

      const adelantos = [
        {
          date: "09/07/2024",
          client: "20,00 Bs"
        }
      ]

      const handleGenerate = () =>{
        const doc = new jsPDF()
        
        const titleX = 20; // X position for text
        const titleY = 30; // Y position for text
        const titleWidth = 180; // Width of the background rectangle
        const titleHeight = 25; // Height of the background rectangle

        doc.setFillColor(29,213,144);
        doc.rect(titleX - 2, titleY - 6, titleWidth, titleHeight, 'F');

        doc.setFontSize(18)
        doc.setTextColor("white")
        doc.text("COMPROBANTE DE PRODUCTOS ENTREGADOS", titleX+5, titleY+5)
        doc.text("AL ALMACEN", titleX+50, titleY+15)

        doc.setFontSize(10)
        doc.setTextColor("black")
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`,
                doc.internal.pageSize.width - 50,
                titleY + titleHeight + 5,
              )
        
        const tableX = titleX
        const tableY = titleY + titleHeight + 15

        const productData = data.map((val,i)=>[val.producto,val.unitartio,val.cantidad,val.total])
        // productData.push(['Total', '', '', `${data.reduce((acc, val) => acc+val.total,0)}`])

        doc.autoTable({
            head:[['Producto','Precio Unitario','Cantidad','Total']],
            body: productData,
            columnStyles:{
                0:{cellWidth:80},
                1:{cellWidth:40},
                2:{cellWidth:20},
                3:{cellWidth:30}
            },
            headStyles:{
                fillColor: [29,213,144],
                textColor: "white"
            },
            startY: tableY,
            margin: {left: tableX},
            didDrawPage: (data: any) => {
              const finalY = data.cursor.y; // Get the Y-coordinate where the table ends
              
              // Add text below the table
              doc.setFontSize(10)
              doc.setTextColor('black')
              doc.text('FIRMA', tableX + 30, finalY + 30); 
              doc.text("Nombre Engcargado:", tableX + 10, finalY + 40)
              doc.text("CI:",tableX + 10, finalY+50)

              doc.text('FIRMA', doc.internal.pageSize.width / 2 + 30 , finalY + 30); 
              doc.text("Nombre Cliente:", doc.internal.pageSize.width / 2 + 10, finalY + 40)
              doc.text("CI:", doc.internal.pageSize.width / 2 + 10, finalY+50)
            }
        })
        
        doc.save('demoPDF.pdf')
      }

      const handleGeneratePayment = () => {
        const doc = new jsPDF()
        
        const titleX = 20; // X position for text
        const titleY = 30; // Y position for text
        const titleWidth = 170; // Width of the background rectangle
        const titleHeight = 10; // Height of the background rectangle

        doc.setFillColor(29,213,144);
        doc.rect(titleX - 2, titleY - 6, titleWidth, titleHeight, 'F');

        doc.setFontSize(18)
        doc.setTextColor("white")
        doc.text("COMPROBANTE DE PAGOS", titleX + 40, titleY)

        doc.setFontSize(10)
        doc.setTextColor("black")
        doc.text(`Fecha: ${new Date().toLocaleDateString()}`,
                doc.internal.pageSize.width - 50,
                titleY + titleHeight + 5,
              )
          
        doc.text(`Cliente: Deborah Matienzo Gamon`,
          titleX, 
          titleY + titleHeight + 5
        )

        const tableX = titleX
        const tableY = titleY + titleHeight + 15

        doc.autoTable({
            head:[['Producto','Precio Unitario','Cantidad','Total']],
            body: data.map((val,i)=>[val.producto,val.unitartio,val.cantidad,val.total]),
            columnStyles:{
                0:{cellWidth:80},
                1:{cellWidth:40},
                2:{cellWidth:20},
                3:{cellWidth:30}
            },
            headStyles:{
                fillColor: [29,213,144],
                textColor: "white"
            },
            startY: tableY,
            margin: {left: tableX},
        })

        doc.autoTable({
          head:[['Fecha','ADELANTOS RECIBIDOS DE CLIENTES']],
          body: adelantos.map((val,i)=>[val.date,val.client]),
          columnStyles:{
              0:{cellWidth:80},
              1:{cellWidth:40},
          },
          headStyles:{
              fillColor: [29,213,144],
              textColor: "white"
          },
          margin: {left: tableX},
          didDrawPage: (data: any) => {
            const finalY = data.cursor.y; // Get the Y-coordinate where the table ends
            doc.setFontSize(10)
            doc.setTextColor('black')

            doc.text(`PAGO REALIZADO: 3910.01 Bs`,
              titleX, 
              finalY + 5
            )

            doc.text('FIRMA', tableX + 30, finalY + 30); 
            doc.text("Nombre Cliente:", tableX , finalY + 40)
            doc.text("CI:",tableX , finalY+50)
          }
      })

        doc.save('payment.pdf')
  
      }

  return (
    <div>
       <button onClick={handleGenerate}>Generate PDF</button> 

       <button onClick={handleGeneratePayment}>Generate PDF</button> 
    </div>
  )
}

export default showPDF