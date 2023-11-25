"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const commonUtils_1 = require("./commonUtils");
function retryGenerator(mainFun, errorConditionFun, waitPeriod, retryCount, factor) {
    let currentTry = 0;
    let currentWaitPeriod = waitPeriod;
    return function retry() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield mainFun();
            if (errorConditionFun(res)) {
                console.error('error', res);
                if (currentTry <= retryCount) {
                    console.log('retrying... currentTry->', currentTry, 'with wait period of->', currentWaitPeriod);
                    currentTry++;
                    yield (0, commonUtils_1.wait)(currentWaitPeriod);
                    currentWaitPeriod = currentWaitPeriod * factor;
                    yield retry();
                }
                else {
                    console.log('retrycount exhausted. currentTry->', currentTry);
                    return res;
                }
            }
            return res;
        });
    };
}
exports.default = retryGenerator;
/** Eg
 *
 function foo(m){
    const num = Math.floor((Math.random(10)*m))
    return num
}

const retryableFunction = retryGenerator(()=>foo(1000),(res)=>res%2,10,5)

 *
 *
*/
//# sourceMappingURL=retry.js.map