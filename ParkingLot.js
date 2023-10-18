'use strict';

const fs = require('fs');

process.stdin.resume();
process.stdin.setEncoding("ascii");
let inputString = "";
let currentLine = 0;

process.stdin.on("data", function (chunk) {
    inputString += chunk;
});
process.stdin.on("end", function () {
    inputString = inputString.split('\n');
    main();
});

function readLine() {
    return inputString[currentLine++];
}

class ParkingLot {
    constructor(slots) {
        this.slots = slots;
        this.parkingSlots = new Array(slots).fill(null);
    }

    park(carId) {
        const emptySlotIndex = this.parkingSlots.findIndex(slot => slot === null);
        if (emptySlotIndex !== -1) {
            this.parkingSlots[emptySlotIndex] = carId;
            return true;
        }
        return false;
    }

    remove(carId) {
        const carIndex = this.parkingSlots.indexOf(carId);
        if (carIndex !== -1) {
            this.parkingSlots[carIndex] = null;
            return true;
        }
        return false;
    }

    getSlots() {
        return this.parkingSlots.map((carId, index) => carId || null);
    }
}

function main() {
    const ws = fs.createWriteStream(process.env.OUTPUT_PATH);
    
    const numberOfSlots = parseInt(readLine().trim());
    const parkingLotObj = new ParkingLot(numberOfSlots);
    ws.write(`Parking Lot created with number of slots as ${numberOfSlots}\n`);
    
    let numberOfOperations = parseInt(readLine().trim());
    while (numberOfOperations-- > 0) {
        const [operation, carId] = readLine().trim().split(' ');

        switch(operation) {
            case 'Park':
                if (parkingLotObj.park(carId)) {
                    ws.write(`Parking Started: ${carId}\n`);
                } else {
                    ws.write(`Parking Full: ${carId}\n`);
                }
                break;
            case 'Remove':
                if (parkingLotObj.remove(carId)) {
                    ws.write(`Car id ${carId} removed from parking\n`);
                } else {
                    ws.write(`Car: ${carId} not found\n`);
                }
                break;
            case 'GetSlots':
                const slotsStatus = parkingLotObj.getSlots();
                slotsStatus.forEach((carId, index) => {
                    if (carId !== null) {
                        ws.write(`Parked at slot ${index + 1}: ${carId}\n`);
                    } else {
                        ws.write(`Slot ${index + 1} is empty\n`);
                    }
                });
                break;
            default:
                break;
        }
    }
    ws.end();
}
