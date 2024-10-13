const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

async function getGoogleSheetContent(docUrl) {
  try {
    const response = await axios.get(docUrl);
    const html = response.data;

    const $ = cheerio.load(html);
    const data = [];

    $('tr span').each((i, elem) => {
      data.push($(elem).text());
    });

    return data.slice(3, data.length)
  } catch (error) {
    console.error('Error fetching the document:', error);
  }
}

function getMaxX(data){
    let result = 0
    for(let i=0; i<data.length; i=i+3){
        if(Number(data[i])>result)
            result = Number(data[i])
    }
    return result;
}

function getMaxY(data){
    let result = 0
    for(let i=2; i<data.length; i=i+3){
        if(Number(data[i])>result)
            result = Number(data[i])
    }
    return result;
}


const googleDocUrl =
  'https://docs.google.com/document/d/e/2PACX-1vShuWova56o7XS1S3LwEIzkYJA8pBQENja01DNnVDorDVXbWakDT4NioAScvP1OCX6eeKSqRyzUW_qJ/pub';


async function decode() {
  const content = await getGoogleSheetContent(googleDocUrl);
  const maxX = await getMaxX(content)
  const maxY = await getMaxY(content)
  const newMatrix =[]

  for(let row = 0; row <= maxX; row++){
    let newRow = []
    for(let column = 0; column<=maxY; column++){
        newRow.push(' ')
    }
    newMatrix.push(newRow)
  }

  for(let a = 0; a<content.length-3;a=a+3){
    newMatrix[Number(content[a])][Number(content[a+2])]=content[a+1]
  }

  for(let rows of newMatrix){
    const rowString = rows.join(' ')
    console.log(rowString)
  }
}

decode();
