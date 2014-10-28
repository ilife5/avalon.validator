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
	: NOT PATTERN			{$$ = [$1, $2]}
	|'(' PATTERN ')'		{$$ = $2}
	| PATTERN AND PATTERN	{$$ = [$1, $2, $3]}
	| PATTERN OR PATTERN	{$$ = [$1, $2, $3]}
	| RULE 					{$$ = $1}
	;
RULE
    : RULENAME              {$$ = {name:$1}}
    | RULENAME ARGS         {$$ = {name:$1, value:$2.slice(0,$2.length-1).slice(1)}}
    ;
%%