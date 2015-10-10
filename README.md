# 简介

avalon.validator是一个基于avalon的验证框架，既保证和avalon的无缝连接，又保证了自己的丰富功能和灵活性。主要的功能包括：

+ 支持html5中的特性，如required；input控件中的type，email|url|number|range|date|month|week|time|color。

+ 通过在控件上增加<code>data-validator-pattern</code>属性，支持自定义的验证pattern。

+ 验证显示结果定制化

# How to

avalon.validator是avalon的ui组件，页面内引入avalon及ui组件后可按照如下使用：

	<div ms-controll="validation">
		<form ms-widget="validator,$,$opts">
			<label>姓名：<input required ms-duplex="name" data-validator-pattern="word&&maxlength[20]" placeholder="支持字母和数字，长度不大于20"/></label>
			<label>邮箱：<input required ms-duplex="email" type="email" placeholder="请输入邮箱"/></label>
		</form>
	</div>

验证显示结果可定制化，如：

```
avalon.define({
	"$id"": "validation",	
	"onValidate": function (element, result) {
        var $element = avalon(element);

        if (!result.result) {
            if ($element.data("error")) {
                return;
            }
            $element.data("error", true);
            getParentWithClassName(element, "l-form-cell").appendChild(avalon.parseHTML('<i class="fa fa-exclamation-triangle e-icon-warn tooltip-trigger" tp="'
                + result.message + '"></i>'));
        } else {
            $element.data("error", false);
            var icon = getParentWithClassName(element, "l-form-cell").getElementsByClassName("tooltip-trigger")[0];
            icon && icon.parentNode.removeChild(icon);
        }
    }
});
```

对当前组件下包含的控件进行验证：

	<!-- 利用avalon作用域，可以将组件的validate方法注入按钮的操作中 -->
	<div ms-controll="validation">
		<form ms-widget="validator,$,$opts">
			<!-- ... -->
			<button type="button" ms-click="submit(validate)"></button>
		</form>
	</div>
	
	<script>
		avalon.define({
			"$id": "validation",
			/**
			 * @param valiate {Function}	验证方法返回Promise对象
			 */
			"submit": function( validate ) {
				/**
				 * @param result
				  {
				  	result: {Boolean},	//验证结果
				  	messages: {Array}	//验证错误信息列表
			 	  }				
				 */
				validate().then(function( result ) {
					if(result.result) {
						//submit ...
					} else {
						alert(result.messages.join(""));
					}
				});
			}
		});	
	</script>
		
# test

	karma start