class Sudoku {
    // 输入格式要求0作为占位符(表示待填)，只接受数字字符串，长度为81位
    /**
     *Creates an instance of Sudoku.
     * @param {String} input
     * @param {number} [maxCount=1]
     * @memberof Sudoku
     */
    constructor(input, maxCount = 1) {
        this.matrix = [
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 0],
        ];
        this.candidature = [
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", ""],
        ]; // 候选数
        this.count = 0; // 用于统计解的数量
        this.maxCount = maxCount; // 解的最大数量

        if (input == null || input.length != 81 || !input.match(/[0-9]+/)) throw new Error("必须为81位长度的纯数字字符串");
        this.init(input);
        this.output();
        this.maxCount = maxCount <= 0 ? 1 : maxCount;
        if (!this.isValid()) throw new Error("无效数独(有数字重复)");
        if (!this.initCandidature()) throw new Error("不合格数独（无解数独）");
    }

    getCount() {
        return this.count;
    }

    /**
     *
     *
     * @param {String} input
     * @memberof Sudoku
     */
    init(input) {
        for (let i = 0; i < input.length; i++) {
            let s = input.substring(i, i + 1);
            let value = s * 1;
            this.matrix[this.realEx(i, 9)][i % 9] = value;
        }
    }

    // 校验给出的数独题目是否为有效数独（即某行列宫中有重复的数字则无效）
    isValid() {
        let rowSet = new Set();
        let colSet = new Set();
        let gridSet = new Set();
        for (let x = 0; x < 9; x++) {
            // 对应于行列宫号，对应宫的起始位置为(x/3*3,x%3*3) 取余与乘除优先级相同
            rowSet.clear();
            colSet.clear();
            gridSet.clear();
            for (let index = 0; index < 9; index++) {
                if (this.matrix[x][index] > 0 && !rowSet.add(this.matrix[x][index])) {
                    // 行重复
                    alert(`数独无效,第${x + 1}行重复！`);
                    return false;
                }
                if (this.matrix[index][x] > 0 && !colSet.add(this.matrix[index][x])) {
                    // 列重复
                    alert(`数独无效,第${x + 1}列重复！`);
                    return false;
                }
                if (
                    this.matrix[this.realEx(x, 3) * 3 + this.realEx(index, 3)][(x % 3) * 3 + (index % 3)] > 0 &&
                    !gridSet.add(this.matrix[this.realEx(x, 3) * 3 + this.realEx(index, 3)][(x % 3) * 3 + (index % 3)])
                ) {
                    alert(`数独无效,第${x + 1}宫重复！`);
                    return false; // 宫重复
                }
            }
        }
        return true;
    }

    // 初始化候选数(唯一法或唯余法),数独无解返回false
    initCandidature() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.matrix[i][j] > 0) continue;
                this.candidature[i][j] = "";
                for (let k = 1; k <= 9; k++) {
                    if (this.check(i, j, k)) {
                        this.candidature[i][j] += k;
                    }
                }
                // 如果待填格子候选数个数为0，不合格数独（无解数独）
                if (this.candidature[i][j] == null || this.candidature.length == 0) {
                    return false; // 无解数独
                }
                // 候选数个数为1，对应于唯一法或唯余法，可以100%的将该候选数填入该格子中，并重新计算候选数
                if (this.candidature[i][j].length == 1) {
                    let k = this.candidature[i][j] * 1;
                    this.matrix[i][j] = k;
                    console.log(`唯一(余)法必填项(${i}, ${j}, ${k})`);
                    this.deleteCandidature(i, j, k);
                }
                // System.out.println(String.format("(%d,%d)",i,j)+"->"+this.candidature[i][j]);
            }
        }
        return true;
    }

    /**
     * 删除(i,j)等位格群上的候选数k，当(i,j)上可以肯定的填入数字k时(等位格局包含除自身外共20个格子)
     * 每次调用此方法后，候选数发生了变化，需要再次检查唯一（余）性质
     * @param {Number} i
     * @param {Number} j
     * @param {Number} k
     * @returns
     * @memberof Sudoku
     */
    deleteCandidature(i, j, k) {
        let change = false;
        for (let index = 0; index < 9; index++) {
            if (this.matrix[i][index] == 0 && this.candidature[i][index] != null && this.candidature[i][index].includes(k)) {
                this.candidature[i][index] = this.candidature[i][index].replaceAll(k, "");
                change = true;
            }
            if (this.matrix[index][j] == 0 && this.candidature[index][j] != null && this.candidature[index][j].includes(k)) {
                this.candidature[index][j] = this.candidature[index][j].replaceAll(k, "");
                change = true;
            }
            if (
                this.matrix[this.realEx(i, 3) * 3 + this.realEx(index, 3)][this.realEx(j, 3) * 3 + (index % 3)] == 0 &&
                this.candidature[this.realEx(i, 3) * 3 + this.realEx(index, 3)][this.realEx(j, 3) * 3 + (index % 3)] != null &&
                this.candidature[this.realEx(i, 3) * 3 + this.realEx(index, 3)][this.realEx(j, 3) * 3 + (index % 3)].includes(k)
            ) {
                this.candidature[this.realEx(i, 3) * 3 + this.realEx(index, 3)][this.realEx(j, 3) * 3 + (index % 3)] = this.candidature[
                    this.realEx(i, 3) * 3 + this.realEx(index, 3)
                ][this.realEx(j, 3) * 3 + (index % 3)].replaceAll(k, "");
                change = true;
            }
        }
        return change;
    }

    /**
     * 唯一法或唯余法或唯一候选数法，检查每个格子候选数的个数是否为1
     * 此为最基础的方法、应用其他方法发生了删减候选数时都要应用此方法检查一遍
     * @returns
     * @memberof Sudoku
     */
    single() {
        console.log("唯一法或唯余法:");
        let change = false; // 表示是否候选数是否发生变化(当有删除候选数操作时则发生了变化)
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.matrix[i][j] == 0 && this.candidature[i][j].length == 1) {
                    let k = this.candidature[i][j] * 1;
                    this.matrix[i][j] = k;
                    console.log(`唯一(余)法必填项(${i}, ${j}, ${k})`);
                    if (this.deleteCandidature(i, j, k)) change = true;
                }
            }
        }
        return change; // 若无删减候选数操作，意味着一个必填项都没有找到返回false
    }

    // 摒除法或隐性唯一候选数法,某个数字候选数只在该宫(行列)中的某一个格子出现（按照数字）,即在该宫所有格子所有候选数中总共只出现一次。
    exclude() {
        console.log("摒除法：");
        let change = false; // 表示是否候选数是否发生变化(当有删除候选数操作时则发生了变化)
        let rowCount = 0; // 行循环时，用于统计数字k出现的次数
        let colCount = 0; // 列循环时，用于统计数字k出现的次数
        let gridCount = 0; // 宫循环时，用于统计数字k出现的次数
        let rowPos = 0; // 行循环时，用于标识k最后一次出现的位置
        let colPos = 0; // 列循环时，用于标识k最后一次出现的位置
        let gridPos = 0; // 宫循环时，用于标识k最后一次出现的位置
        let gridFirstPos = 0; // 宫循环时，用于标识k出现的第1次位置
        let gridSecondPos = 0; // 宫循环时，用于标识k出现的第2次位置
        for (let k = 1; k < 9; k++) {
            for (let x = 0; x < 9; x++) {
                // 行列宫循环次数
                rowCount = 0;
                colCount = 0;
                gridCount = 0;

                rowPos = 0;
                colPos = 0;
                gridPos = 0;
                for (let index = 0; index < 9; index++) {
                    // 行，k统计
                    if (this.matrix[x][index] == 0 && this.candidature[x][index].includes(k)) {
                        rowCount++;
                        rowPos = index; // 记录k在最后一次出现的位置
                    }
                    // 列，k统计
                    if (this.matrix[index][x] == 0 && this.candidature[index][x].includes(k)) {
                        colCount++;
                        colPos = index; // 记录k在最后一次出现的位置
                    }
                    // 宫，k统计
                    if (
                        this.matrix[this.realEx(x, 3) * 3 + this.realEx(index, 3)][(x % 3) * 3 + (index % 3)] == 0 &&
                        this.candidature[this.realEx(x, 3) * 3 + this.realEx(index, 3)][(x % 3) * 3 + (index % 3)].includes(k)
                    ) {
                        gridCount++;
                        gridPos = index; // 记录k在最后一次出现的位置
                        if (gridCount == 1) {
                            // k第一次出现的位置
                            gridFirstPos = index;
                        }
                        if (gridCount == 2) gridSecondPos = index;
                    }
                }
                if (this.matrix[x][rowPos] == 0 && rowCount == 1) {
                    // 表示该格子只能填入k
                    this.matrix[x][rowPos] = k;
                    console.log(`行摒除法必填项(${x}, ${rowPos}, ${k})`);
                    if (this.deleteCandidature(x, rowPos, k) && this.single())
                        // 删除等位格群上的候选数k
                        change = true;
                }
                if (this.matrix[colPos][x] == 0 && colCount == 1) {
                    // 表示该格子只能填入k
                    this.matrix[colPos][x] = k;
                    console.log(`列摒除法必填项(${colPos}, ${x}, ${k})`);
                    if (this.deleteCandidature(colPos, x, k) && this.single())
                        // 删除等位格群上的候选数k
                        change = true;
                }
                if (this.matrix[this.realEx(x, 3) * 3 + this.realEx(gridPos, 3)][(x % 3) * 3 + (gridPos % 3)] == 0 && gridCount == 1) {
                    // 表示该格子只能填入k
                    this.matrix[this.realEx(x, 3) * 3 + this.realEx(gridPos, 3)][(x % 3) * 3 + (gridPos % 3)] = k;
                    console.log(`宫摒除法必填项(${this.realEx(x, 3) * 3 + this.realEx(gridPos, 3)}, ${(x % 3) * 3 + (gridPos % 3)}, ${k})`);
                    if (this.deleteCandidature(this.realEx(x, 3) * 3 + this.realEx(gridPos, 3), (x % 3) * 3 + (gridPos % 3), k) && this.single())
                        // 删除等位格群上的候选数k
                        change = true;
                }
                // 特殊条件：某一个数字在某一个宫中恰好只出现2次或3次，并且出现的位置恰好形成一条线（行或列），
                // 则可以删除该线上的其它宫格中的这个数字
                // 恰好只出现一次时，摒除法可以处理
                if (gridCount == 2) {
                    if (this.realEx(gridFirstPos, 3) == this.realEx(gridPos, 3)) {
                        // 恰好同行，则删除同行上的数字k
                        let row = this.realEx(x, 3) * 3 + this.realEx(gridFirstPos, 3); // 行号
                        if (this.cutCandidature(row * 9 + (x % 3) * 3 + (gridFirstPos % 3), row * 9 + (x % 3) * 3 + (gridPos % 3), -1, k, 1, 1)) {
                            if (this.single()) change = true;
                            console.log(
                                `${x} 宫中数字 ${k} 恰好只出现在同行的两格：(${row}, ${(x % 3) * 3 + (gridFirstPos % 3)}, ${
                                    this.candidature[row][(x % 3) * 3 + (gridFirstPos % 3)]
                                })(${row}, ${(x % 3) * 3 + (gridPos % 3)}, ${this.candidature[row][(x % 3) * 3 + (gridPos % 3)]})`
                            );
                        }
                    } else if (gridFirstPos % 3 == gridPos % 3) {
                        // 恰好同列，则删除同列上的其他数字k
                        let col = (x % 3) * 3 + (gridFirstPos % 3); // 列号
                        if (
                            this.cutCandidature(
                                (this.realEx(x, 3) * 3 + this.realEx(gridFirstPos, 3)) * 9 + col,
                                (this.realEx(x, 3) * 3 + this.realEx(gridPos, 3)) * 9 + col,
                                -1,
                                k,
                                2,
                                1
                            )
                        ) {
                            if (this.single()) change = true;
                            console.log(
                                `${x} 宫中数字 ${k} 恰好只出现在同列的两格：(${this.realEx(x, 3) * 3 + this.realEx(gridFirstPos, 3)}, ${col}, ${
                                    this.candidature[this.realEx(x, 3) * 3 + this.realEx(gridFirstPos, 3)][col]
                                })(${this.realEx(x, 3) * 3 + this.realEx(gridPos, 3)}, ${col}, ${this.candidature[this.realEx(x, 3) * 3 + this.realEx(gridPos, 3)][col]})`
                            );
                        }
                    }
                }
                if (gridCount == 3) {
                    // 恰好出现3次
                    if (this.realEx(gridFirstPos, 3) == this.realEx(gridSecondPos, 3) && this.realEx(gridFirstPos, 3) == this.realEx(gridPos, 3)) {
                        // 恰好3个同行
                        let row = this.realEx(x, 3) * 3 + this.realEx(gridFirstPos, 3); // 行号
                        if (
                            this.cutCandidature(
                                row * 9 + (x % 3) * 3 + (gridFirstPos % 3),
                                row * 9 + (x % 3) * 3 + (gridSecondPos % 3),
                                row * 9 + (x % 3) * 3 + (gridPos % 3),
                                k,
                                1,
                                1
                            )
                        ) {
                            if (this.single()) change = true;

                            console.log(
                                `${x} 宫中数字 ${k} 恰好只出现在同行的三格：(${row}, ${(x % 3) * 3 + (gridFirstPos % 3)}, ${
                                    this.candidature[row][(x % 3) * 3 + (gridFirstPos % 3)]
                                })(${row}, ${(x % 3) * 3 + (gridSecondPos % 3)}, ${this.candidature[row][(x % 3) * 3 + (gridSecondPos % 3)]})(${row}, ${
                                    (x % 3) * 3 + (gridPos % 3)
                                }, ${this.candidature[row][(x % 3) * 3 + (gridPos % 3)]})`
                            );
                        }
                    } else if (gridFirstPos % 3 == gridPos % 3 && gridFirstPos % 3 == gridSecondPos % 3) {
                        // 恰好3个同列
                        let col = (x % 3) * 3 + (gridFirstPos % 3); // 列号
                        if (
                            this.cutCandidature(
                                (this.realEx(x, 3) * 3 + this.realEx(gridFirstPos, 3)) * 9 + col,
                                (this.realEx(x, 3) * 3 + this.realEx(gridSecondPos, 3)) * 9 + col,
                                (this.realEx(x, 3) * 3 + this.realEx(gridPos, 3)) * 9 + col,
                                k,
                                2,
                                1
                            )
                        ) {
                            if (this.single()) change = true;

                            console.log(
                                `${x} 宫中数字 ${k} 恰好只出现在同列的三格：(${this.realEx(x, 3) * 3 + this.realEx(gridFirstPos, 3)}, ${col}, ${
                                    this.candidature[this.realEx(x, 3) * 3 + this.realEx(gridFirstPos, 3)][col]
                                })(${this.realEx(x, 3) * 3 + this.realEx(gridSecondPos, 3)}, ${col}, ${
                                    this.candidature[this.realEx(x, 3) * 3 + this.realEx(gridSecondPos, 3)][col]
                                })(${this.realEx(x, 3) * 3 + this.realEx(gridPos, 3)}, ${col}, ${this.candidature[this.realEx(x, 3) * 3 + this.realEx(gridPos, 3)][col]})`
                            );
                        }
                    }
                }
            }
        }
        return change; // 若没有删减候选数操作，返回false
    }

    // 隐性三链数删减法：在某行，存在三个数字出现在相同的宫格内，在本行的其它宫格均不包含这三个数字，我们称这个数对是隐形三链数。
    // 那么这三个宫格的候选数中的其它数字都可以排除。当隐形三链数出现在列，九宫格，处理方法是完全相同的。
    /*
     * private boolean hiddenTriplesCut(){ return false;//返回false表示没有删减 } private
     * boolean hiddenPairsCut(){ return false;//返回false表示没有删减 }
     */
    // 三链数删减法：找出某一列、某一行或某一个九宫格中的某三个宫格候选数中，相异的数字不超过3个的情形，
    // 进而将这3个数字自其它宫格的候选数中删减掉的方法就叫做三链数删减法。
    nakedTriplesCut() {
        console.log("三链数删减法：");
        let change = false;
        for (let x = 0; x < 9; x++) {
            // 需要用3重循环遍历某行所有格子3个结合的情况
            for (let aPos = 0; aPos < 9 - 2; aPos++) {
                // a循环到倒数第3个即可
                // 行
                if (this.matrix[x][aPos] == 0 && this.candidature[x][aPos].length <= 3) {
                    for (let bPos = aPos + 1; bPos < 9 - 1; bPos++) {
                        // b循环到倒数第1个即可
                        if (this.matrix[x][bPos] == 0 && this.candidature[x][bPos].length <= 3) {
                            for (let cPos = bPos + 1; cPos < 9; cPos++) {
                                if (this.matrix[x][cPos] == 0 && this.candidature[x][cPos].length <= 3) {
                                    let keys = this.unionSet(this.candidature[x][aPos], this.candidature[x][bPos], this.candidature[x][cPos]);
                                    if (keys.length <= 3) {
                                        console.log(
                                            `${x} 行找到三链数：(${x}, ${aPos}, ${this.candidature[x][aPos]})(${x}, ${bPos}, ${this.candidature[x][bPos]})(${x}, ${cPos}, ${this.candidature[x][cPos]})：${keys}`
                                        );
                                        if (this.cutCandidature(x * 9 + aPos, x * 9 + bPos, x * 9 + cPos, keys, 1, 1) && this.single()) change = true;
                                    }
                                }
                            }
                        }
                    }
                }
                // 列
                if (this.matrix[aPos][x] == 0 && this.candidature[aPos][x].length <= 3) {
                    for (let bPos = aPos + 1; bPos < 9 - 1; bPos++) {
                        // b循环到倒数第2个即可
                        if (this.matrix[bPos][x] == 0 && this.candidature[bPos][x].length <= 3) {
                            for (let cPos = bPos + 1; cPos < 9; cPos++) {
                                if (this.matrix[cPos][x] == 0 && this.candidature[cPos][x].length <= 3) {
                                    let keys = this.unionSet(this.candidature[aPos][x], this.candidature[bPos][x], this.candidature[cPos][x]);
                                    if (keys.length <= 3) {
                                        console.log(
                                            `${x} 列找到三链数：(${aPos}, ${x}, ${this.candidature[aPos][x]})(${bPos}, ${x}, ${this.candidature[bPos][x]})(${cPos}, ${x}, ${this.candidature[cPos][x]})：${keys}`
                                        );
                                        if (this.cutCandidature(aPos * 9 + x, bPos * 9 + x, cPos * 9 + x, keys, 2, 1) && this.single()) change = true;
                                    }
                                }
                            }
                        }
                    }
                }
                // 宫
                let iStart = this.realEx(x, 3) * 3;
                let jStart = (x % 3) * 3;
                if (this.matrix[iStart + this.realEx(aPos, 3)][jStart + (aPos % 3)] == 0 && this.candidature[iStart + this.realEx(aPos, 3)][jStart + (aPos % 3)].length <= 3) {
                    for (let bPos = aPos + 1; bPos < 9 - 1; bPos++) {
                        // b循环到倒数第2个即可
                        if (
                            this.matrix[iStart + this.realEx(bPos, 3)][jStart + (bPos % 3)] == 0 &&
                            this.candidature[iStart + this.realEx(bPos, 3)][jStart + (bPos % 3)].length <= 3
                        ) {
                            for (let cPos = bPos + 1; cPos < 9; cPos++) {
                                if (
                                    this.matrix[iStart + this.realEx(cPos, 3)][jStart + (cPos % 3)] == 0 &&
                                    this.candidature[iStart + this.realEx(cPos, 3)][jStart + (cPos % 3)].length <= 3
                                ) {
                                    let keys = this.unionSet(
                                        this.candidature[iStart + this.realEx(aPos, 3)][jStart + (aPos % 3)],
                                        this.candidature[iStart + this.realEx(bPos, 3)][jStart + (bPos % 3)],
                                        this.candidature[iStart + this.realEx(cPos, 3)][jStart + (cPos % 3)]
                                    );
                                    if (keys.length <= 3) {
                                        console.log(
                                            `${x} 宫找到三链数：(${iStart + this.realEx(aPos, 3)}, ${jStart + (aPos % 3)}, ${
                                                this.candidature[iStart + this.realEx(aPos, 3)][jStart + (aPos % 3)]
                                            })(${iStart + this.realEx(bPos, 3)}, ${jStart + (bPos % 3)}, ${this.candidature[iStart + this.realEx(bPos, 3)][jStart + (bPos % 3)]})(${
                                                iStart + this.realEx(cPos, 3)
                                            }, ${jStart + (cPos % 3)}, ${this.candidature[iStart + this.realEx(cPos, 3)][jStart + (cPos % 3)]})：${keys}`
                                        );
                                        if (
                                            this.cutCandidature(
                                                (iStart + this.realEx(aPos, 3)) * 9 + jStart + (aPos % 3),
                                                (iStart + this.realEx(bPos, 3)) * 9 + jStart + (bPos % 3),
                                                (iStart + this.realEx(cPos, 3)) * 9 + jStart + (cPos % 3),
                                                keys,
                                                3,
                                                1
                                            ) &&
                                            this.single()
                                        ) {
                                            change = true;
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        return change; // 返回false表示没有删减
    }

    // 数对删减法,如果某宫中两个格子的候选数个数只有2个且都一样，则可以删除其他格子中的这两个候选数
    // 数对删减法
    nakedPairsCut() {
        console.log("数对删减法：");
        let change = false;
        for (let x = 0; x < 9; x++) {
            // 需要双层循环两两组合
            for (let aPos = 0; aPos < 9 - 1; aPos++) {
                // a循环到倒数第2个即可
                // 行
                if (this.matrix[x][aPos] == 0 && this.candidature[x][aPos].length == 2) {
                    for (let bPos = aPos + 1; bPos < 9; bPos++) {
                        if (this.matrix[x][bPos] == 0 && this.candidature[x][bPos].length == 2) {
                            let keys = this.unionSet(this.candidature[x][aPos], this.candidature[x][bPos], "");
                            if (keys.length == 2) {
                                console.log(`${x} 行找到数对：(${x}, ${aPos},${this.candidature[x][aPos]})(${x}, ${bPos},${this.candidature[x][bPos]})：${keys}`);
                                if (this.cutCandidature(x * 9 + aPos, x * 9 + bPos, -1, keys, 1, 1) && this.single()) change = true;
                            }
                        }
                    }
                }
                // 列
                if (this.matrix[aPos][x] == 0 && this.candidature[aPos][x].length == 2) {
                    for (let bPos = aPos + 1; bPos < 9; bPos++) {
                        if (this.matrix[bPos][x] == 0 && this.candidature[bPos][x].length == 2) {
                            let keys = this.unionSet(this.candidature[aPos][x], this.candidature[bPos][x], "");
                            if (keys.length == 2) {
                                console.log(`${x} 列找到数对：(${aPos}, ${x},${this.candidature[aPos][x]})(${bPos}, ${x},${this.candidature[bPos][x]})：${keys}`);
                                if (this.cutCandidature(aPos * 9 + x, bPos * 9 + x, -1, keys, 2, 1) && this.single()) change = true;
                            }
                        }
                    }
                }
                // 宫
                let iStart = this.realEx(x, 3) * 3;
                let jStart = (x % 3) * 3;
                if (this.matrix[iStart + this.realEx(aPos, 3)][jStart + (aPos % 3)] == 0 && this.candidature[iStart + this.realEx(aPos, 3)][jStart + (aPos % 3)].length == 2) {
                    for (let bPos = aPos + 1; bPos < 9; bPos++) {
                        if (
                            this.matrix[iStart + this.realEx(bPos, 3)][jStart + (bPos % 3)] == 0 &&
                            this.candidature[iStart + this.realEx(bPos, 3)][jStart + (bPos % 3)].length == 2
                        ) {
                            let keys = this.unionSet(
                                this.candidature[iStart + this.realEx(aPos, 3)][jStart + (aPos % 3)],
                                this.candidature[iStart + this.realEx(bPos, 3)][jStart + (bPos % 3)],
                                ""
                            );
                            if (keys.length == 2) {
                                console.log(
                                    `${x} 宫找到数对：(${iStart + this.realEx(aPos, 3)}, ${jStart + (aPos % 3)},${
                                        this.candidature[iStart + this.realEx(aPos, 3)][jStart + (aPos % 3)]
                                    })(${iStart + this.realEx(bPos, 3)}, ${jStart + (bPos % 3)},${this.candidature[iStart + this.realEx(bPos, 3)][jStart + (bPos % 3)]})：${keys}`
                                );
                                if (
                                    this.cutCandidature(
                                        (iStart + this.realEx(aPos, 3)) * 9 + jStart + (aPos % 3),
                                        (iStart + this.realEx(bPos, 3)) * 9 + jStart + (bPos % 3),
                                        -1,
                                        keys,
                                        3,
                                        1
                                    ) &&
                                    this.single()
                                )
                                    change = true;
                            }
                        }
                    }
                }
            }
        }
        return change;
    }

    /*
     * //四链数删减法，尽管此法应用得不多，但在特殊情况下能找到必填项 private boolean quadruplexes(){ boolean
     * change = false;
     *
     * return change; }
     */

    /**
     *
     *
     * @param {Number} a a的绝对位置，取值0~80
     * @param {Number} b b的绝对位置，取值0~80
     * @param {Number} c c的绝对位置，取值0~80或者-1，取-1时，表示数对删减法
     * @param {String} keys 候选数
     * @param {Number} type 取值1、2、3，分别表示为 行删除、列删除、宫删除
     * @param {Number} method 取值1、2，分别表示为三链数（数对）删除法（删其他格子）、隐性三链数删除法（删自身格子）
     * @returns {Boolean}
     * @memberof Sudoku
     */
    cutCandidature(a, b, c, keys, type, method) {
        let change = false;
        if (method == 1) {
            let f = false; // 临时变量
            for (let index = 0; index < 9; index++) {
                switch (type) {
                    case 1: // 行
                        f = this.matrix[this.realEx(a, 9)][index] == 0 && index != a % 9 && index != b % 9;
                        if (c >= 0) f = f && index != c % 9;
                        if (f && this.deleteKeysFromCandidature(this.realEx(a, 9), index, keys)) {
                            change = true;
                        }
                        break;
                    case 2: // 列
                        f = this.matrix[index][a % 9] == 0 && index != this.realEx(a, 9) && index != this.realEx(b, 9);
                        if (c >= 0) f = f && index != this.realEx(c, 9);
                        if (f && this.deleteKeysFromCandidature(index, a % 9, keys)) {
                            change = true;
                        }
                        break;
                    case 3: // 宫
                        let absPos = (this.realEx((this.realEx(a, 9), 3)) * 3 + this.realEx(index, 3)) * 9 + this.realEx(a % 9, 3) * 3 + (index % 3);
                        // [i/3*3+index/3][j/3*3+index%3]
                        // 计算绝对位置i*9+j
                        if (
                            this.matrix[this.realEx(this.realEx(a, 9), 3) * 3 + this.realEx(index, 3)][this.realEx(a % 9, 3) * 3 + (index % 3)] == 0 &&
                            absPos != a &&
                            absPos != b &&
                            absPos != c
                        ) {
                            if (this.deleteKeysFromCandidature(this.realEx(this.realEx(a, 9), 3) * 3 + this.realEx(index, 3), this.realEx(a % 9, 3) * 3 + (index % 3), keys))
                                change = true;
                        }
                        break;
                    default:
                }
            }
        } else {
        }
        return change;
    }

    /**
     * 取abc三个字符串的并集
     * 取a,b,c字符串的并集
     *
     * @param {String} a
     * @param {String} b
     * @param {String} c
     * @returns {String}
     * @memberof Sudoku
     */
    unionSet(a, b, c) {
        if (a == null || b == null || c == null) return null;
        let d = a + b + c;
        let chars = d.split("");
        let set = new Set();
        let sb = "";
        for (let i = 0; i < chars.length; i++) {
            if (set.add(chars[i])) {
                sb += chars[i];
            }
        }
        return sb.toString();
    }

    /**
     *从(i,j)候选数中删除指定的候选数keys
     *
     * @param {Number} i
     * @param {Number} j
     * @param {String} keys
     * @returns {Boolean}
     * @memberof Sudoku
     */
    deleteKeysFromCandidature(i, j, keys) {
        let change = false;
        for (let k = 0; k < keys.length; k++) {
            let key = keys.substring(k, k + 1);
            if (this.matrix[i][j] == 0 && this.candidature[i][j].includes(key)) {
                console.log(`从(${i}, ${j}) ${this.candidature[i][j]} 中删除候选数 -> ${key}`);
                this.candidature[i][j] = this.candidature[i][j].replaceAll(key, "");
                change = true;
            }
        }
        return change;
    }

    /**
     * 万能解题法的“搜索+剪枝”,递归与回溯
     *
     * @param {Number} i
     * @param {Number} j
     * @returns
     * @memberof Sudoku
     */
    execute(i, j) {
        if (i === undefined) {
            return this.executeDFT();
        }
        // 寻找可填的位置（即空白格子），当前(i,j)可能为非空格，从当前位置当前行开始搜索
        // 此处用于结束下面的双层循环,标记不赞成使用，但在此处很直观
        outer: for (let x = i; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (this.matrix[x][y] == 0) {
                    i = x;
                    j = y;
                    break outer;
                }
            }
        }
        // 如果从当前位置并未搜索到一个可填的空白格子，意味着所有格子都已填写完了，所以找到了解
        if (this.matrix[i][j] != 0) {
            this.count++;
            console.log(`第 ${this.count} 种解：`);
            this.output();
            if (this.count == this.count) return true;
            // return true 表示只找寻一种解，false表示找所有解
            else return false;
        }
        // 试填k
        for (let k = 1; k <= 9; k++) {
            if (!this.check(i, j, k)) continue;
            this.matrix[i][j] = k; // 填充
            // System.out.println(String.format("(%d,%d,%d)",i,j,k));
            if (i == 8 && j == 8) {
                // 填的正好是最后一个格子则输出解
                this.count++;
                console.log(`第 ${this.count} 种解：`);
                this.output();
                if (this.count == this.count) return true;
                // return true 表示只找寻一种解，false表示找所有解
                else return false;
            }
            // 计算下一个元素坐标，如果当前元素为行尾，则下一个元素为下一行的第一个位置（未填数），
            // 否则为当前行相对当前元素的下一位置
            let nextRow = j < 9 - 1 ? i : i + 1;
            let nextCol = j < 9 - 1 ? j + 1 : 0;
            if (this.execute(nextRow, nextCol)) return true; // 此处递归寻解，若未找到解，则返回此处,执行下面一条复位语句
            // 递归未找到解，表示当前(i,j)填k不成功，则继续往下执行复位操作，试填下一个数
            this.matrix[i][j] = 0;
        }
        // 1~9都试了
        return false;
    }

    // 反复应用唯一（余）法检查每个格子的候选数的个数是否为1以及应用摒除法找寻必填数字
    // 直到候选数不在发生变化（即没有候选数删减操作）
    // 最后才用递归寻解
    executeDFT() {
        let flag = true;
        while (flag) {
            let f1 = this.single(); // 唯一（余）法，最基础的方法、应用其他方法发生了删减候选数时都要应用此方法
            let f2 = this.exclude(); // 摒除法，优先级比唯一（余）法低一点点，也是最基础的方法
            let f3 = this.nakedPairsCut(); // 数对删减法
            flag = f1 || f2 || f3;

            if (!flag) {
                let f4 = this.nakedTriplesCut(); // 三链数删减法
                flag = f4;
            }
            // 再应用一次基础方法，确保万无一失
            if (!flag) {
                f1 = this.single();
                f2 = this.exclude();
                flag = f1 || f2;
            }
        }
        // outputCandidature();
        console.log("人工方式求解：");
        this.output();
        // 递归求解
        this.execute(0, 0); // 从第一个位置开始递归寻解
    }
    /**
     *
     *
     * @param {Number} a
     * @param {Number} b
     * @returns {Number}
     * @memberof Sudoku
     */
    realEx(a, b) {
        return Math.floor(a / b);
    }

    /**
     * 数独规则约束，行列宫唯一性,检查(i,j)位置是否可以填k
     *
     * @param {Number} i
     * @param {Number} j
     * @param {Number} k
     * @returns {Boolean}
     * @memberof Sudoku
     */
    check(i, j, k) {
        // 行列约束,宫约束，对应宫的范围 起始值为(i/3*3,j/3*3),即宫的起始位置行列坐标只能取0,3,6
        for (let index = 0; index < 9; index++) {
            if (this.matrix[i][index] == k) return false;
            if (this.matrix[index][j] == k) return false;
            if (this.matrix[this.realEx(i, 3) * 3 + this.realEx(index, 3)][this.realEx(j, 3) * 3 + (index % 3)] == k) return false;
        }
        return true;
    }

    output() {
        console.log(this.matrix);
        // for (let i = 0; i < 9; i++) {
        //     for (let j = 0; j < 9; j++) {
        //         if (j % 3 == 0)
        //             System.out.print(" ");
        //         System.out.print(this.matrix[i][j]);
        //     }
        //     System.out.println();
        //     if (i % 3 == 2)
        //         System.out.println("-------------");
        // }
    }

    outputCandidature() {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (this.matrix[i][j] == 0) {
                    console.log(`候选数(${i}, ${j}) -> ${this.candidature[i][j]}`);
                }
            }
        }
    }

    // public static void main(String[] args) {
    //     try {
    //         Sudoku sudoku = new Sudoku(
    //                 "005000300008053006200010000006900020000000863500000070700801002320600407000000000", 2);
    //         // Sudoku sudoku = new
    //         // Sudoku("000000000000001002034000050000000030000026000005000470000700000100400000680000001",1);
    //         // Sudoku sudoku = new
    //         // Sudoku("123456789456789123789123456234567891567891234891234567345000000000000000000000000",20);
    //         // Sudoku sudoku = new
    //         // Sudoku("000000000000001023004560000000000000007080400010002500000600000020000010300040000",1);
    //         long begin = System.currentTimeMillis();
    //         sudoku.execute();
    //         System.out.println("执行时间" + (System.currentTimeMillis() - begin) + "ms");
    //         if (sudoku.getCount() == 0)
    //             System.out.println("未找到解");
    //     } catch (Exception e) {
    //         e.printStackTrace();
    //     }
    // }
}
