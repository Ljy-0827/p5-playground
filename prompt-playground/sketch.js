let rects = [];
let isDragging = false;
let xOffset, yOffset;
let selectedRect = null;

let roleRectColor = '#C1E9FF';
let descriptionRectColor = '#FFE4E4';
let resultRectColor = '#CCF8E3';
let actionRectColor = '#FFE9AF';

let roleNum = 1;
let actionNum = 3;

const novelData = [];
let gptAnswer = [];

let gptPreTrainDescription = '我需要你根据提供的信息撰写小说，撰写的小说内容请写成完整的一段文字，以start作为小说开始的标志，以end作为小说结束的标志。小说的具体信息为：'



const p5gpt = new P5GPT();


function setup() {
    createCanvas(windowWidth, windowHeight);

    //Button按钮定义
    //添加角色
    addRoleButton = createButton('添加角色');
    addRoleButton.position(72, 50);
    addRoleButton.size(100, 40);
    addRoleButton.mouseClicked(addRole);
    addRoleButton.elt.style.zIndex = "2";

    //添加中间过程
    addActionButton = createButton('添加中间过程')
    addActionButton.position(72, 114);
    addActionButton.size(100, 40);
    addActionButton.mouseClicked(addAction);
    addActionButton.elt.style.zIndex = "2";

    //生成故事按钮
    generateButton = createButton('生成故事');
    generateButton.position(910, 50);
    generateButton.size(100, 104);
    generateButton.mouseClicked(generateStory);

    //新增内容待拖拽区
    newRectArea = createDiv(`<div style="width: 828px; height: 140px; border: dashed 2px gray" ></div>`)
    newRectArea.position(50, 30);

    //内容矩形定义 & init
    rects = [
        {x: 50, y: 250, width: 160, height: 100, text: '输入您的角色', type: 'roleRect', label: '角色', input: null, id: `role1`},
        {x: 240, y: 250, width: 770, height: 100, text: '输入任务描述', type: 'descriptionRect', label: '任务描述', input: null, id: 'description'},
        {x: 50, y: 400, width: 300, height: 100, text: '输入故事的中间过程', type: 'actionRect', label: '中间过程', input: null, id: 'action1'},
        {x: 380, y: 400, width: 300, height: 100, text: '输入故事的中间过程', type: 'actionRect', label: '中间过程', input: null, id: 'action2'},
        {x: 710, y: 400, width: 300, height: 100, text: '输入故事的中间过程', type: 'actionRect', label: '中间过程', input: null, id: 'action3'},
        {x: 50, y: 550, width: 960, height: 200, text: '', type: 'resultRect', label: '结果', input: null, id: 'result1'}]

    /*
    rects = [
        {x: 50, y: 250, width: 160, height: 100, text: '输入您的角色', type: 'roleRect', label: '角色', input: null, id: `role1`},
        {x: 240, y: 250, width: 770, height: 100, text: '输入任务描述', type: 'descriptionRect', label: '任务描述', input: null, id: 'description'},
        {x: 50, y: 400, width: 300, height: 100, text: '输入故事的中间过程', type: 'actionRect', label: '中间过程', input: null, id: 'action1'},
        {x: 380, y: 400, width: 300, height: 100, text: '输入故事的中间过程', type: 'actionRect', label: '中间过程', input: null, id: 'action2'},
        {x: 710, y: 400, width: 300, height: 100, text: '输入故事的中间过程', type: 'actionRect', label: '中间过程', input: null, id: 'action3'},
        {x: 50, y: 550, width: 465, height: 100, text: '', type: 'resultRect', label: '结果', input: null, id: 'result1'},
        {x: 545, y: 550, width: 465, height: 100, text: '', type: 'resultRect', label: '结果', input: null, id: 'result2'}];
     */
}

function addRole(){
    roleNum ++;
    rects.push({x: 240, y: 62, width: 160, height: 100, text: '输入您的角色', type: 'roleRect', label: '角色', input: null, id: `role${roleNum}`})
}

function addAction(){
    actionNum ++;
    rects.push({x: 240, y: 62, width: 300, height: 100, text: '输入故事的中间过程', type: 'actionRect', label: '中间过程', input: null, id: `action${actionNum}`})
}

function generateStory(){
    // 遍历所有矩形对象，将其内容添加到小说信息中
    for (let rectObj of rects) {
        if (rectObj.text) {
            novelData.push({id: rectObj.id, text: rectObj.text});
        }
    }
    let prompt = gptPreTrainDescription + JSON.stringify(novelData);
    // 调用 P5GPT 的 dialog 方法
    p5gpt.dialog(prompt)
        .then(response => {
            // 处理 ChatGPT 的回复，你可以在这里做任何你想要的操作
            console.log(response);
            // 定义开始和结束标志
            let start = 'start';
            let end = 'end';

            let startIndex = response.indexOf(start);
            let endIndex = response.indexOf(end);

            if (startIndex !== -1 && endIndex !== -1 && startIndex < endIndex) {
                gptAnswer = response.substring(startIndex + start.length, endIndex);
            } else {
                // 如果未找到开始或结束标志，则保留原始字符串
                gptAnswer = '生成错误';
            }
            console.log(gptAnswer);
            const result1 = document.getElementById('result1');
            result1.innerText = gptAnswer;

        })
        .catch(error => {
            console.error(error);
        });


}

function mousePressed() {
    for(let rectObj of rects) {
        if(mouseX > rectObj.x && mouseX < rectObj.x + rectObj.width &&
            mouseY > rectObj.y && mouseY < rectObj.y + rectObj.height){
            isDragging = true;
            selectedRect = rectObj;
            xOffset = mouseX - rectObj.x;
            yOffset = mouseY - rectObj.y;
            break;
        }
    }
}

function mouseDragged() {
    if (isDragging) {
        selectedRect.x = mouseX - xOffset;
        selectedRect.y = mouseY - yOffset;
    }
}

function mouseReleased() {
    isDragging = false;
    selectedRect = null;
}

function draw() {
    background(250);
    for (let rectObj of rects) {
        if(rectObj.type === 'roleRect'){
            fill(roleRectColor);
        }else if(rectObj.type === 'descriptionRect'){
            fill(descriptionRectColor);
        }else if(rectObj.type === 'actionRect'){
            fill(actionRectColor);
        }else if(rectObj.type === 'resultRect'){
            fill(resultRectColor);
        }
        rect(rectObj.x, rectObj.y, rectObj.width, rectObj.height);

        // 计算文本框的位置，使其在长方形内，比长方形小10像素
        let inputX = constrain(rectObj.x + 10, 0, width - rectObj.width - 20);
        let inputY = constrain(rectObj.y + 10, 0, height - rectObj.height - 20);
        let inputWidth = rectObj.width - 28;
        let inputHeight = rectObj.height - 26;

        // 创建或更新文本框，并将其置于长方形之上
        if(rectObj.input){
            rectObj.input.position(inputX, inputY);
            rectObj.input.size(inputWidth, inputHeight);
        }else{
            rectObj.input = createDiv(`<textarea style="height: 100%; width: 100%; border: none; background-color: transparent; outline: none; resize:none; " id="${rectObj.id}" placeholder="${rectObj.text}"></textarea>`);
            rectObj.input.position(inputX, inputY);
            rectObj.input.elt.style.zIndex = "1";
            // 添加事件监听器监听文本变化
            rectObj.input.elt.querySelector('textarea').addEventListener('input', function() {
                rectObj.text = this.value;
            });
        }

        //计算标题的位置
        let labelX = rectObj.x;
        let labelY = rectObj.y - 23;

        // 创建或更新不可编辑文本
        if (rectObj.labelElement) {
            rectObj.labelElement.position(labelX, labelY);
        } else {
            rectObj.labelElement = createDiv(rectObj.label);
            rectObj.labelElement.style('font-size: 13px;')
            rectObj.labelElement.position(labelX, labelY);
            rectObj.labelElement.elt.style.zIndex = "1";
        }
    }
}

