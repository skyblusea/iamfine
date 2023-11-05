
let datas = [
  {
    "id":0,
    "value": 75,
  },
  {
    "id":1,
    "value": 20,
  },
  {
    "id":2,
    "value": 80,
  },
  {
    "id":3,
    "value": 100,
  },
  {
    "id":4,
    "value": 70,
  },
];
const dataFromLocalStorage = localStorage.getItem('datas');
if (dataFromLocalStorage) {
  datas = JSON.parse(dataFromLocalStorage);
} 


//삭제
const handleDelete = (id) => {
  const row = document.querySelector( `#table_data_${id}`);
  const filteredData = datas.filter((data) => data.id !== id);
  datas = filteredData;
  localStorage.setItem('datas', JSON.stringify(datas));
  row.remove();
}


//render
datas.map((data) => {
  const tr = document.createElement('tr');
  tr.setAttribute('id', `table_data_${data.id}`);
  const idTd = document.createElement('td');
  idTd.textContent = data.id;
  tr.appendChild(idTd);

  const valueTd = document.createElement('td');
  valueTd.textContent = data.value;
  tr.appendChild(valueTd);
  
  const deleteTd = document.createElement('td');
  const deleteButton = document.createElement('button');
  deleteButton.textContent = '삭제';
  deleteButton.addEventListener('click', (e)=>handleDelete(data.id));
  deleteTd.appendChild(deleteButton);
  tr.appendChild(deleteTd);
  
  const tableBody = document.querySelector('tbody');
  tableBody.appendChild(tr); 
})


//추가
const addTable = (e) => {
  e.preventDefault();
  const form = e.currentTarget
  const formData = new FormData(form)
  const id = formData.get('id')
  const value = formData.get('value')
  isExist = datas.some((data) => data.id === Number(id));
  if (isExist) {
    alert('이미 존재하는 id입니다.')
    return;
  }
  const data = {
    id: Number(id),
    value:  Number(value),
  }
  datas.push(data);
  localStorage.setItem('datas', JSON.stringify(datas));
  location.reload();
}

const form = document.querySelector('.form');
form.addEventListener('submit', (e) => addTable(e))

//그래프 출력
const applyHandler = () => {
  const length = datas.length;
  const calc = 40.5 + 50*length + 40.5;
  const path = document.querySelector('.x-axios');
  path.setAttribute('d', `M40.5,1V0.5H${calc}V1`);
  datas.map((data,idx)=>{
    const g = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    g.classList.add('x-tick');
    g.setAttribute('opacity', 1);
    g.setAttribute('id', `tick_${data.id}`)
    const tickPosition = 40.5+50*(idx+1)
    g.setAttribute('transform', `translate(${tickPosition},0)`);
    const line = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'line'
    );
    line.setAttribute('stroke','currentColor')
    line.setAttribute('y2',6)
    g.appendChild(line)
    const text = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'text'
    );    
    text.setAttribute('fill','currentColor')
    text.setAttribute('y','9')
    text.setAttribute('dy','0.71em')
    text.textContent = data.id
    g.appendChild(text)
    const xlabel = document.querySelector('#x-label');
    xlabel.appendChild(g)

    const barG = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'g'
    );
    barG.setAttribute('opacity', 1);
    barG.setAttribute('transform', `translate(${tickPosition},0)`);

    const rect = document.createElementNS(
      'http://www.w3.org/2000/svg',
      'rect'
    );
    const rectheight = (370.5-20.5)/100*Number(data.value)
    const rectPosition = 370.5-((370.5-20.5)/100*data)
    rect.setAttribute('fill','#DFDFDF')
    rect.setAttribute('x','-10')
    rect.setAttribute('y',`-${rectheight}`)
    rect.setAttribute('width','20')
    rect.setAttribute('height',`${rectheight}`)
    barG.appendChild(rect)

    const bars = document.querySelector('#bars');
    bars.appendChild(barG)
  })
}

applyHandler();

const applyBtn = document.querySelector('.apply_btn');  
applyBtn.addEventListener('click', ()=>{
  applyHandler();
  location.reload();
});


const textarea = document.querySelector('textarea');
text = JSON.stringify(datas)
text = text.replaceAll('[{', '[\n  {');
text = text.replaceAll('}]', '\n  }\n]');
text = text.replaceAll('},{', '\n  },\n  {');
text = text.replaceAll('{', '{\n    ');
text = text.replaceAll(',"', ',\n    "');
textarea.value = text
textarea.style.height = `${textarea.scrollHeight+10}px`

const rawdataForm = document.querySelector('.rawdata_form');
rawdataForm.addEventListener('submit', (e)=>{
  e.preventDefault();
  const form = e.currentTarget
  const formData = new FormData(form)
  const rawdata = formData.get('rawdata')
  parsed = JSON.parse(rawdata);
  const isInvalid = parsed.some((ele,idx) => {
    if((!ele.id && ele.id!==0) || !ele.value) {
      alert('id와 value는 필수입니다.')
      return true;
    } 
    if (ele.value > 100 ) {
      alert('100이 넘는 value는 입력할 수 없습니다')
      return true;
    }
    if(parsed.some((el,index)=>(idx!==index && ele.id===el.id))) {
      alert('중복되는 id가 있습니다.')
      return true;
    }
    return false;
  })

  if (!isInvalid) {
    datas = parsed;
    localStorage.setItem('datas', JSON.stringify(datas));
    location.reload();
  }
})