
// 获取元素
const randomNumber = document.getElementById('randomNumber');
const randomNumber1 = document.getElementById('randomNumber1');
const randomNumber2 = document.getElementById('randomNumber2');
const button1 = document.getElementById('button1');
const button2 = document.getElementById('button2');
const rightOrWrongElement = document.getElementById('rightOrWrong');
const cuoWu = document.getElementById('cuowu');
const zhengQue = document.getElementById('zhengque');
const daCuoLa = document.getElementById('dacuola');
const niTaiBangLe = document.getElementById('nitaibangle');
const yanHua = document.getElementById('yanHua');
const scoreDiv = document.getElementById('score');

var score = 0; //初始化得分
scoreDiv.textContent = `得分:${score}`;


// 声音淡入函数
function fadeIn(audio, duration = 2000) {
    audio.volume = 0; // 初始音量为 0
    audio.play(); // 开始播放音频
    const step = 0.1; // 每次增加的音量
    const interval = duration / (1 / step); // 计算间隔时间
    const fadeInInterval = setInterval(() => {
        if (audio.volume < 1) {
            audio.volume = Math.min(audio.volume + step, 1); // 增加音量，最大为 1
        } else {
            clearInterval(fadeInInterval); // 停止淡入
        }
    }, interval);
}

// 声音淡出函数
function fadeOut(audio, duration = 2000) {
    const step = 0.1; // 每次减少的音量
    const interval = duration / (1 / step); // 计算间隔时间
    const fadeOutInterval = setInterval(() => {
        if (audio.volume > 0) {
            audio.volume = Math.max(audio.volume - step, 0); // 减少音量，最小为 0
        } else {
            clearInterval(fadeOutInterval); // 停止淡出
            audio.pause(); // 暂停音频
            audio.currentTime = 0; // 重置播放进度
            audio.volume = 1;//重置音量为1
        }
    }, interval);
}
function createRetryButton() {
    // 检查是否已经存在按钮，避免重复创建
    if (document.getElementById('retryButton')) return;

    // 创建按钮
    const retryButton = document.createElement('button');
    retryButton.id = 'retryButton';
    retryButton.textContent = '再试一次';

    // 设置按钮样式
    retryButton.style.position = 'absolute';// 设置按钮位置
    retryButton.style.top = '60%';//距离顶部距离60%
    retryButton.style.left = '50%';// 设置按钮距离左侧的距离
    retryButton.style.transform = 'translateX(-50%)';// 使按钮居中
    retryButton.style.padding = '10px 20px';// 设置按钮的填充和边框
    retryButton.style.fontSize = '16px';// 设置字体大小
    retryButton.style.color = '#fff';// 设置字体颜色
    retryButton.style.backgroundColor = '#007bff';// 设置背景颜色
    retryButton.style.border = 'none';// 设置边框
    retryButton.style.borderRadius = '5px';// 设置圆角
    retryButton.style.cursor = 'pointer';// 设置鼠标悬停时的光标样式

    // 添加悬停效果
    retryButton.addEventListener('mouseover', () => {
        retryButton.style.backgroundColor = '#0056b3';
    });
    retryButton.addEventListener('mouseout', () => {
        retryButton.style.backgroundColor = '#007bff';
    });

    // 绑定点击事件
    retryButton.addEventListener('click', () => {
        // 移除恭喜消息和按钮
        document.getElementById('congratsMessage').remove();
        retryButton.remove();
        
        //停止烟花音效
        fadeOut(yanHua, 1500);//1.5秒内淡出
        fireworks.length = 0; // 清空烟花
        isFireworksActive = false; //停止生成新的烟花

        // 重置积分
        score = 0;
        scoreDiv.textContent = `得分: ${score}`; // 更新得分显示
        loop();//重新开始游戏
        //将隐藏的元素显示出来
        randomNumber.style.display = 'flex';
        randomNumber1.style.display = 'flex';
        randomNumber2.style.display = 'flex';
        button1.style.display = 'inline-block';
        button2.style.display = 'inline-block';
    });
    // 将按钮添加到页面
    document.body.appendChild(retryButton);
    }

function JudgementScore(){
    //判断得分是否小于100
    if(score < 100){
            rightOrWrongElement.textContent = ''; //清空判断符号
            loop(); // 重新生成随机数
    }else {
        // 隐藏元素
        randomNumber.style.display = 'none';
        randomNumber1.style.display = 'none';
        randomNumber2.style.display = 'none';
        button1.style.display = 'none';
        button2.style.display = 'none';
        rightOrWrongElement.textContent = '';
        
        // 显示恭喜消息
        const congratsMessage = document.createElement('div');
        congratsMessage.id = 'congratsMessage';
        congratsMessage.textContent = '恭喜你达到 100 分！';
        congratsMessage.style.position = 'absolute';
        congratsMessage.style.top = '30%';
        congratsMessage.style.left = '50%';
        congratsMessage.style.transform = 'translate(-50%, -50%)';
        congratsMessage.style.fontSize = '36px';
        congratsMessage.style.color = '#fff';
        congratsMessage.style.textAlign = 'center';
        document.body.appendChild(congratsMessage);

        // 创建“再试一次”按钮
        createRetryButton();
        isFireworksActive = true;//放烟花
        yanHua.loop = true;//开启循环播放
        //yanHua.vloume = 1;//重置音频音量为1
        yanHua.play();//播放音频
    }
}
function handleButtonClick(button) {
    //获取按钮的文本内容并把该内容显示到div2中,并判断是否正确
    const buttonText = button.textContent; // 获取按钮的文本内容
    randomNumber2.textContent = buttonText; // 将按钮文本显示到div2中
    if(randomNumber2.textContent == randomNumber.textContent - randomNumber1.textContent){
        score += 10
        scoreDiv.textContent = `得分:${score}`
        zhengQue.currentTime = 0; //重置播放进度
        niTaiBangLe.currentTime = 0;
        zhengQue.play(); //播放生音  
        niTaiBangLe.play();
        rightOrWrongElement.textContent = '✔'; // 插入对勾符号
        // 延时1秒后执行
        setTimeout(() => {
            JudgementScore();
            }, 1000); // 1秒后执行
        
    }else{
        cuoWu.currentTime = 0;
        daCuoLa.currentTime = 0;
        cuoWu.volume = 0.2 //将音量设置为20%
        cuoWu.play();
        daCuoLa.play();
        rightOrWrongElement.textContent = '✘'; // 插入叉叉符号
    }
}


function generateRandomNumber(num, num2=0) {
    //生成1到9的随机数
     while(true){
        const N = Math.floor(Math.random() * num) + 1;
        //如果生成的数字为num2，则重新生成随机数
        if(N === num2){
            continue;
        }else{
            return N;
        }
    }
    
}

function loop(){
    //获取随机数并显示在div元素中
    let number = generateRandomNumber(9, 1);
    let number1 = generateRandomNumber(number-1);
    let number2 = '?';
    //将number显示在div元素中
    randomNumber.textContent = number;
    randomNumber1.textContent = number1;
    randomNumber2.textContent = number2;

    //将答案随机显示在两个按钮中
    if(Math.random() < 0.5) {
        button1.textContent = number - number1;
        button2.textContent = generateRandomNumber(9, number - number1);
    }else {
        button1.textContent = generateRandomNumber(9, number - number1);
        button2.textContent = number - number1;
    }
}
loop(); //调用函数








