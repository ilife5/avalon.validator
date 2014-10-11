/* description: Parses end executes mathematical expressions. */

/* lexical grammar */

%lex

%%
\s+             /* skip whitespace */
"("             return '(';
")"             return ')';
"&&"            return 'AND';
"||"            return 'OR';
"!"             return 'NOT';
[a-zA-Z0-9_\-]+ return 'RULENAME';
"[".*?"]"       return 'ARGS';
<<EOF>>         return 'EOF';

/lex

/* operator associations and precedence */

%left      'AND' 'OR'
%left      'NOT'

%start expressions

%% /* language grammar */

expressions
    : PATTERN EOF
        {return $1;}
    ;

PATTERN
        : RULES                                 {$$ = $1}
        | '(' PATTERN ')' DOP '(' PATTERN ')'   {$$ = [$2, $4, $6]}
        | NOT '(' PATTERN ')'                   {$$ = [$1, $3]}
        ;
RULES
        : RULE              {$$ = $1}
        | RULES DOP RULE    {$$ = [$1, $2, $3]}
        ;
RULE
        : RULENAME          {$$ = {name:$1}}
        | RULENAME ARGS     {$$ = {name:$1, value:$2.slice(0,$2.length-1).slice(1)}}
        | NOT RULE          {$$ = [$1, $2]}
        ;
DOP
        : AND
        | OR
        ;
%%

//判断是否为计算表达式
function isCalculate(expression) {
    return avalon.type(expression) === "array" && expression.length > 1
}

//判断expression的类型
//如果expression的类型为一元或者二元操作，包装为该操作结果的promise对象
//在过程中，对操作符进行相应处理
//如果expression的类型为表达式RULE，直接返回可以代表该RULE的promise对象
//在Deferred中，resolve相当于正常的call, apply语句， reject相当于throw语句，otherwise相当于catch 语句，ensure相当于finally语句
function parseExpression(expression) {

    var dfd = Deferred()

    if(isCalculate(expression)) {
        parseCalculate(expression).then(function(result) {
            dfd.resolve(result)
        }, function() {
            dfd.resolve(arguments)
        })
    } else {

        var pattern = avalon.validatorPattern[expression.name],
            result

        if(!pattern) {
            dfd.reject({
                message: "没有找到相应的pattern：" + expression.name
            })
        } else {
            result = pattern.validate(expression.value)

            if(Deferred.isPromise(result)) {
                result.then(function(result) {
                    //resolve
                    dfd.resolve(result)
                }, function() {
                    dfd.reject(arguments)
                })
            } else {
                dfd.resolve(result)
            }
        }
    }

    return dfd.promise
}

function parseCalculate(calculateArr) {

    var dfd = new Deferred()

    if(calculateArr.length === 2) {
        parseExpression(calculateArr[1]).then(function(result) {
            //resolve 进行一元运算
            dfd.resolve(!result)
        }, function() {
            //reject
            dfd.reject(arguments)
        })
    } else {
        Deferred.all(parseExpression(calculateArr[0]), parseExpression(calculateArr[2])).then(function(leftResult, rightResult) {
            //resolve 进行二元运算
            if(calculateArr[1] === "&&") {
                dfd.resolve(leftResult && rightResult)
            } else {
                dfd.resolve(leftResult || rightResult)
            }
        }, function() {
            //reject
            dfd.reject(arguments)
        })
    }

    return dfd.promise
}