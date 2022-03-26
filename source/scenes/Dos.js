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
            Advertising: [
                { option: "None", difficulty: 0, cost: 0, costOpportunity: 0 },
                { option: "Radio", difficulty: 1, cost: 200, costOpportunity: 400 },
                { option: "Newspaper", difficulty: 1, cost: 100, costOpportunity: 200 },
            ],
        }
        this.currentGame = {};
        this.gameReady = false;
        this.gameTyping = false;
        this.bytes = 0;
    }

    preload() {
    }

    create() {
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
        }
        )
    }

    update() {
        this.tick++;
        if (this.tick % 1 == 0) {
            this.printChar();
        }
        this.gameTyping = this.printBuffer.length > 0;
        //signals the game has finished
        if (this.gameReady & !this.gameTyping) {
            this.gameReady = false;
            this.currentGame = {};
        }
    }

    log(string) {
        console.log("Logging: ");
        this.printBuffer += '\n' + string;
        console.log(this.printBuffer);
    }

    printChar() {
        if (this.printBuffer.length > 0) {
            this.internalLog += this.printBuffer[0];
            this.printBuffer = this.printBuffer.substr(1);
            this.logText.setText(this.internalLog);
        }
    }

    makeChoice(input) {
        if (!this.gameReady) {
            console.log("input = " + input)
            let keys = Object.keys(this.options)
            console.log(keys);
            console.log(this.selectedChoice, this.options[keys[this.programmingStage]].length)
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
                this.currentGame[keys[this.programmingStage]] = this.options[keys[this.programmingStage]][this.selectedChoice];
                this.log(`//Note to self: ${keys[this.programmingStage]} => ${this.options[keys[this.programmingStage]][this.selectedChoice].option}`)
                this.log(`//Will probably cost me around: $${this.options[keys[this.programmingStage]][this.selectedChoice].cost}`)
                this.log(`//This choice will probably make this project ${this.options[keys[this.programmingStage]][this.selectedChoice].difficulty}/5 more complex`)

                if (this.programmingStage == 3) {
                    this.gameReady = true;
                    this.selectedChoice = 0;
                    this.programmingStage = 0;
                    this.cursorText.setText("> ");
                    let profit = 
                    this.log("I should be ready to program now!\n\n Let's start!");
                    this.log(this.create);
                    //this.log(this.makeChoice);
                    this.log("Waiting for payment . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .");
                    this.log("I made $xxxx\n");
                } else {
                    this.selectedChoice = 0;
                    this.programmingStage++;
                    this.log("// " + keys[this.programmingStage] + "?")
                }
                console.log(this.currentGame);
            }
            if (this.gameReady == false) {
                this.cursorText.setText("> " + this.options[keys[this.programmingStage]][this.selectedChoice].option)
            }
        }
    }

    getRandomNum(base, deviation) {
        return base + (Math.random() * deviation);
    }

    startup() {
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