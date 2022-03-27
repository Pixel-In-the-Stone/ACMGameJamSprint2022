class DosScene extends Phaser.Scene {
    constructor() {
        super("DosScene");
    }

    init() {
        this.printBuffer = "";
        this.internalLog = "";
        this.tick = 0;
        this.userChoice = "";
        this.programmingStage = 0;
        this.selectedChoice = 0;
        //{Option, difficulty, cost, costOpportunity}
        this.options = {
            platform: [
                { option: "Desktop", difficulty: 1, cost: 0, costOpportunity: 50 },
                { option: "Integrated Circuit", difficulty: 2, cost: 0, costOpportunity: 100 }
            ],
            topic: [
                { option: "Game", difficulty: 4, cost: 0, costOpportunity: 100 },
                { option: "Accounting", difficulty: 2, cost: 0, costOpportunity: 300 },
                { option: "CIA - TOP SECRET", difficulty: 5, cost: 1000, costOpportunity: 10000 },
            ],
            language: [
                { option: "Assembly", difficulty: 1, cost: 0, costOpportunity: 100 },
                { option: "C++", difficulty: 3, cost: 0, costOpportunity: 150 }
            ],
            advertising: [
                { option: "None", difficulty: 0, cost: 0, costOpportunity: 0 },
                { option: "Radio", difficulty: 1, cost: 200, costOpportunity: 400 },
                { option: "Newspaper", difficulty: 1, cost: 100, costOpportunity: 200 },
            ],
        }
        this.currentGame = { cost: 0 };
        this.gameReady = false;
        this.gameTyping = false;
        this.gameFin = false;
        this.gameEndingRan = false;
        this.bytes = 0;
    }

    preload() {
        this.load.image("man", "../../assets/man.png")
        this.load.audio("key1", "../../assets/key1.mp3")
        this.load.audio("key2", "../../assets/key2.mp3")
        this.load.audio("music", "../../assets/music.wav")
        this.load.audio("fadeIn", "../../assets/fadeIn.wav")
        this.load.audio("bytes", "../../assets/bytes.wav")
    }

    create() {
        this.sound.play("music",{
            loop: true
        })
        //input
        this.up = this.input.keyboard.addKey("UP")
        this.up.on("down", () => {
            this.makeChoice("UP");
        })
        this.down = this.input.keyboard.addKey("DOWN")
        this.down.on("down", () => {
            this.makeChoice("DOWN");
        })
        this.enter = this.input.keyboard.addKey("ENTER")
        this.enter.on("down", () => {
            this.makeChoice("ENTER");
        })

        this.startup();
        //log text
        this.logText = this.add.text(10, 675, "", {
            color: "lightgreen",
            fontSize: 20,
            lineSpacing: 10
        });
        this.logText.setOrigin(0, 1);

        //Cusor Text
        this.cursorText = this.add.text(10, 690, ">", {
            color: "lightgreen",
            fontSize: 20,
            lineSpacing: 10
        })

        //money Text
        this.moneyText = this.add.text(1070, 10, "", {
            color: "lightgreen",
            fontSize: 20,
            lineSpacing: 10
        })
        this.moneyText.setOrigin(1, 0)

        this.man = this.add.image(700, 1000, "man")
            .setOrigin(.5, .5)
            .setScale(2, 2)
            .setAlpha(0);
    }

    update() {
        this.tick++;
        if (this.tick % 3 == 0) {
            this.printChar(this.tick);
        }
        if(this.tick % 8 == 0 && this.gameTyping && this.printBuffer[0] != '-'){
            let soundKey = Math.random() > .5? "key1" : "key2";
            this.sound.play(soundKey);
        }
        this.gameTyping = this.printBuffer.length > 0;
        //signals the game has finished
        if (this.gameReady & !this.gameTyping) {
            if (this.bytes > 10000 && !this.gameFin && !this.gameEndingRan) {
                this.gameWon();
            } else {
                this.log("I should make another Program!");
                this.log("Platform?");
            }
                this.sound.play("bytes")
                this.gameReady = false;
                this.currentGame = { cost: 0 }
                this.moneyText.updateText(" ");
                this.moneyText.setText("Bytes: " + this.bytes.toFixed(2))
                this.makeChoice("UP");
        }
        if (!this.gameTyping && this.gameFin && !this.gameEndingRan) {
            this.gameEndingRan = true;
            this.sound.play("fadeIn")
            this.add.tween({
                targets: this.man,
                duration: 4000,
                repeat: 0,
                alpha: .25,
                onComplete: () => {
                    this.log("Well since computer science is the greatest thing in the world\nI might as well continue making projects here in the real world")
                }
            })
        }
    }

    gameWon() {
        let sw = "-----------------\n"
        this.log("\n\nHey" + sw +
            "I don't know what you did but we have enough bytes to get you out" + sw +
            "Here we go and....." + sw);
        this.gameTyping = true;
        this.gameFin = true;
    }

    log(string) {
        this.printBuffer += '\n' + string;
    }

    printChar(tick) {
        if (this.printBuffer.length > 0 && this.printBuffer[0] != '-') {
            this.internalLog += this.printBuffer[0];
            this.logText.setText(this.internalLog);
        }
        this.printBuffer = this.printBuffer.substr(1);
    }

    makeChoice(input) {
        if (!this.gameReady && !this.gameTyping) {
            console.log("input = " + input)
            let keys = Object.keys(this.options)
            if (input == "UP") {
                this.selectedChoice++;
                if (this.selectedChoice > this.options[keys[this.programmingStage]].length - 1) {
                    this.selectedChoice = 0;
                }
            } else if (input == "DOWN") {
                this.selectedChoice -= 1;
                if (this.selectedChoice < 0) {
                    this.selectedChoice = this.options[keys[this.programmingStage]].length - 1;
                }
            } else if (input == "ENTER") {
                console.log("enter hit");
                console.log(this.options[keys[this.programmingStage]][this.selectedChoice].cost, this.bytes - this.currentGame.cost)
                if (this.options[keys[this.programmingStage]][this.selectedChoice].cost <= (this.bytes - this.currentGame.cost)) {
                    this.currentGame[keys[this.programmingStage]] = this.options[keys[this.programmingStage]][this.selectedChoice];
                    this.log(`//Note to self: ${keys[this.programmingStage]} => ${this.options[keys[this.programmingStage]][this.selectedChoice].option}`)
                    this.log(`//Will probably cost me around: $${this.options[keys[this.programmingStage]][this.selectedChoice].cost}`)
                    this.log(`//This choice will probably make this project ${this.options[keys[this.programmingStage]][this.selectedChoice].difficulty}/5 more complex`)

                    if (this.programmingStage == 3) {
                        this.gameReady = true;
                        this.selectedChoice = 0;
                        this.programmingStage = 0;
                        this.cursorText.setText("> ");
                        this.currentGame = this.sumGame(this.currentGame);
                        this.bytes -= Number(this.currentGame.cost)
                        let profit = (this.currentGame.costOpportunity * this.getRandomNum(.7, .6)).toFixed(2);
                        this.log("I should be ready to program now!\n\n Let's start!");
                        this.log(this.sumGame);
                        this.log("Waiting for payment . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .");
                        this.log(`I made ${profit}\n`);
                        this.bytes += Number(profit);
                    } else {
                        this.currentGame["cost"] += this.options[keys[this.programmingStage]][this.selectedChoice].cost;
                        this.selectedChoice = 0;
                        this.programmingStage++;
                        this.log("// " + keys[this.programmingStage] + "?")
                    }
                } else {
                    this.log("I don't have enough bytes for that!");
                }
            }
            if (this.gameReady == false) {
                this.cursorText.setText("> " + this.options[keys[this.programmingStage]][this.selectedChoice].option + "\t" + "Cost: " + this.options[keys[this.programmingStage]][this.selectedChoice].cost)
            }
        }
    }

    getRandomNum(base, deviation) {
        return base + (Math.random() * deviation);
    }

    sumGame(game) {
        let cost = 0;
        let difficulty = 0;
        let possibleProfit = 0;
        cost += game["platform"].cost;
        cost += game["topic"].cost;
        cost += game["language"].cost;
        cost += game["advertising"].cost;
        difficulty += game["platform"].difficulty;
        difficulty += game["topic"].difficulty;
        difficulty += game["language"].difficulty;
        difficulty += game["advertising"].difficulty;
        possibleProfit += game["platform"].costOpportunity;
        possibleProfit += game["topic"].costOpportunity;
        possibleProfit += game["language"].costOpportunity;
        possibleProfit += game["advertising"].costOpportunity;
        game["cost"] = cost;
        game["difficulty"] = difficulty;
        game["costOpportunity"] = possibleProfit;
        console.log()
        return game;
    }

    startup() {
        let sw = "-----------------\n"
        this.log("Hello\n" + sw + sw +
            "Can you hear me?\n" + sw +
            "You've been trapped in this computer by the evil Rick Astley\n" + sw +
            "We'll try to get you out but we're low on funds to research the issue" + sw +
            "Maybe you can help from your end, we're only 10,000 bytes short (local currency)" + sw +
            "I found a file that might help you\n\n" + sw +
            "cd ./ACM_Game_Jam_Spring_2022/secrets/cia/super_Don't_touch" + sw +
            "read help.txt" + sw +
            "To design a sortware tool use the arrow keys to select key componets when prompted\n" +
            "after you have made the software tools the software will automatically go to market\nand be sold" +
            " make enough money and maybe I will let you out, -Astley\n" + sw +
            "I don't know what that means but we need to go get started on research\n" + sw +
            "Good Luck!-----------------------\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n")
        //Dos Startup
        this.log("Welcome to GJ-Dos\n" +
            "V1.9.1\n" +
            "Detected Devices:\n" +
            "PS/2 Port\n" +
            "USB-1 X 3\n" +
            "Drive C:\n" +
            "Drive D:\n" +
            "Starting GJ-nano . . . . . . . . . . . . . . . . . . . . . .\n" +
            "GJ-nano Successfully Started!\n" +
            "Project Structure: What should I make?\n\n" +
            "Platform?")
    }
}