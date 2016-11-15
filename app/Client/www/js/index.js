var app = angular.module('app', []);

app.controller('MainController', function($scope, $compile) {

	// [ Set the REST API root ]
	$.request.host = "http://localhost:1337/";
    $.restService.host = "http://localhost:1337";

	// [ Page Events ]
	// These functions are invoked whenever the user navigates to the corresponding page
	var pages = {
        purchaseOrder:function(){
//            var exampleResponse = {
//                firstName:"SADF",
//                phoneNumber:"213434",
//                poNumber:"1234",
//                rows:[
//                    {
//                        prodName:"Blender",
//                        quanity:2,
//                        price:100			
//                    }
//                ]
//            }



        },
		searchCustomersResults: function(){

			// [ Make the request for customers ]
			// The search should uses the query string, which is the most RESTful way of searching
			// http://stackoverflow.com/a/1081720
			var query = "?";

			// [ Get search parameters ]
			var custID = $("#searchCustomersPage .custID").val();
			var firstName = $("#searchCustomersPage .firstName").val();
			var lastName = $("#searchCustomersPage .lastName").val();
			var phoneNumber = $("#searchCustomersPage .phoneNumber").val();

			if(custID) query += "custID=" + encodeURI(custID) + "&";
			if(firstName) query += "firstName=" + encodeURI(firstName) + "&";
			if(lastName) query += "lastName=" + encodeURI(lastName) + "&";
			if(phoneNumber) query += "phoneNumber=" + encodeURI(phoneNumber) + "&";

			// [ Make the actual REST request ]
			$.request("GET","/customers" + query).done(renderCustomers);

			// [ Render the customers ]
			function renderCustomers(customers){
				var list = $("<customer-list></customer-list>");

				$.each(customers,function(i,customer){
					var el = $("<customer-item></customer-item>");
					el.attr({
						 "customer-id": customer.custID
						,"first-name": customer.firstName
						,"last-name": customer.lastName
						,"phone-number": customer.phoneNumber
					});

					list.append(el);
				});

				$("#searchCustomersResultsPage").find("customer-list").replaceWith(list);
				$compile(list)($scope);				
			}
		},
		searchProductsResults: function(){
            var prodID   = $("#searchProductsPage .prodID").val();
            var prodName = $("#searchProductsPage .prodName").val();
            var price = $("#searchProductsPage .price").val();
            var prodWeight = $("#searchProductsPage .prodWeight").val();
            var inStock = $("#searchProductsPage .inStock").val();

            var query = "?";
            if(prodID) query += "prodID=" + encodeURI(prodID) + "&";
            if(prodName) query += "prodName=" + encodeURI(prodName) + "&";
            if(price) query += "price=" + encodeURI(price) + "&";
            if(prodWeight) query += "prodWeight=" + encodeURI(prodWeight) + "&";
            if(inStock) query += "inStock=" + encodeURI(inStock) + "&";

            $.request("GET","/products" + query).done(renderProducts);

            function renderProducts(products){
                var list = $("<product-list></product-list>");

                $.each(products,function(i,product){
                    var el = $("<product-item></product-item>");
                    el.attr({
                         "product-id": product.prodID
                        ,"name": product.prodName
                        ,"price": product.price
                        ,"weight": product.prodWeight
                        ,"in-stock": product.inStock
                    });

                    list.append(el);
                });

                $("#searchProductsResultsPage").find("product-list").replaceWith(list);
                $compile(list)($scope);
            }
		},
		searchOrdersResults: function(){
            var orderID   = $("#searchOrdersPage .orderID").val();
            var custID = $("#searchOrdersPage .custID").val();
            var poNumber = $("#searchOrdersPage .poNumber").val();
            var orderDate = $("#searchOrdersPage .orderDate").val();

            var query = "?";
            if(orderID) query += "orderID=" + encodeURI(orderID) + "&";
            if(custID) query += "custID=" + encodeURI(custID) + "&";
            if(poNumber) query += "poNumber=" + encodeURI(poNumber) + "&";
            if(orderDate) query += "orderDate=" + encodeURI(orderDate) + "&";

            $.request("GET","/orders" + query).done(renderOrders);

            function renderOrders(orders){
                var list = $("<order-list></order-list>");

                $.each(orders,function(i,order){
                    var el = $("<order-item></order-item>");
                    el.attr({
                         "order-id": order.orderID
                        ,"customer-id": order.custID
                        ,"po-number": order.poNumber
                        ,"order-date": order.orderDate
                    });

                    list.append(el);
                });

                $("#searchOrdersResultsPage").find("order-list").replaceWith(list);
                $compile(list)($scope);
            }
        },
        searchCartResults: function(){
            var orderID   = $("#searchCartPage .orderID").val();
            var prodID    = $("#searchCartPage .prodID").val();
            var quantity = $("#searchCartPage .quanity").val();
            var custID = $("#searchCartPage .custID").val();
            var prodName = $("#searchCartPage .prodName").val();

            var query = "?";
            if(orderID) query += "orderID=" + encodeURI(orderID) + "&";
            if(prodID) query += "prodID=" + encodeURI(prodID) + "&";
            if(quantity) query += "quantity=" + encodeURI(quantity) + "&";
            if(custID) query += "custID=" + encodeURI(custID) + "&";
            if(prodName) query += "prodName=" + encodeURI(prodName) + "&";

            $.request("GET","/carts" + query).done(renderCarts);

            function renderCarts(carts){
                var list = $("<cart-list></cart-list>");

                $.each(carts,function(i,cart){
                    var el = $("<cart-item></cart-item>");
                    el.attr({
                         "order-id": cart.orderID
                        ,"product-id": cart.prodID
                        ,"quanity": cart.quantity
                    });

                    list.append(el);
                });

                $("#searchCartResultsPage").find("cart-list").replaceWith(list);
                $compile(list)($scope);
            }
        }
	};


	// [ Navigation ]
	(function navigation(){
		var currPage = $(".page").eq(0).attr("id").replace("Page","");
		var currPageLabel = currPage;
		window.pageStack = [currPage];
		window.pageLabelStack = [currPageLabel];
		var fromPage = "";
		window.toPage = "";
		var pageKey = 0;
		var navEl = $("");

		updateTabIndex();

		// [ On Click ]
		$("body").on("click","nav-item",function(){
			fromPage = $(this).closest(".page").attr("id").replace("Page","");
			toPage = $(this).attr("page");
			toLabel = $(this).attr("label");
			$(".navItem").removeClass("selected");
			navigate(fromPage,toPage,toLabel);
		});

		$(document).keydown(function(e){
			if(dontJump){
				dontJump = false;
				return;
			}

			var page = $("#" + currPage + "Page");

			if (e.keyCode == 9 && e.shiftKey == false) {
				if($(document.activeElement).prop("tagName").toLowerCase() != "input"){
					e.preventDefault();
					page.find("input").first().focus();
				}
			}
		})

		var dontJump = false;

		// [ Don't Tab to Url Bar ]
		$('input:visible').on('keydown', function (e) {
			var page = $("#" + currPage + "Page");

			if($(this).index() == page.find("input").last().index()){
			    if (e.keyCode == 9 && e.shiftKey == false) {
			        e.preventDefault();
			        $(this).blur();
			        dontJump = true;
			       // $('.page input:visible').first().focus();
			    }				
			}
		});

		// [ On Key Press ]
		$(document).keydown(function(e){
			// If focused in textbox, don't use nav control hotkeys
			if($(document.activeElement).prop("tagName").toLowerCase() == "input" 
			 		|| $(document.activeElement).prop("tagName").toLowerCase() == "textarea"){
				return;
			}

			var number = e.keyCode - 48;
			var pageEl = $("#" + currPage + "Page");
			navEl = pageEl.find("nav-item").eq(number - 1);
			fromPage = pageEl.attr("id").replace("Page","");
			toPage = navEl.attr("page");
			toLabel = navEl.attr("label");

			$("nav-item").not(navEl).find(".navItem").removeClass("selected");
			navEl.find(".navItem").addClass("selected");
			

			pageKey = number;
		})

		$(document).keyup(function(e){
			// If focused in textbox, don't use nav control hotkeys
			if($(document.activeElement).prop("tagName").toLowerCase() == "input" 
			 		|| $(document.activeElement).prop("tagName").toLowerCase() == "textarea"){
				return;
			}

			var number = e.keyCode - 48;
			$("nav-item").not(navEl).find(".navItem").removeClass("selected");
			if(number == pageKey){
				if(toPage){
					navigate(fromPage,toPage,toLabel);
				}
			}	
		})

		function navigate(fromPage,toPage){
            if(toPage=="none") return;
			if(toPage == "back"){
				pageStack.pop();
				pageLabelStack.pop();

				toPage = pageStack[pageStack.length - 1];

				$("#" + fromPage + "Page").addClass("moveRight");
				$("#" + toPage + "Page").removeClass("moveLeft").removeClass("moveRight");


				currPage = toPage;
									
			}else{
				$("#" + fromPage + "Page").addClass("moveLeft");
				$("#" + toPage + "Page").removeClass("moveLeft").removeClass("moveRight");

				currPage = toPage;
				pageStack.push(toPage);
				pageLabelStack.push(toLabel);
			}			

			// [ Update page stack ]
			var pageStackStr = "/ ";
			$.each(pageLabelStack, function(i,page){
				pageStackStr += page.toLowerCase().split("-")[0] + " / ";
			})

			$("#pageStack").text(pageStackStr);

			// [ Invoke page logic ]
			if(typeof pages[toPage] === "function"){
				pages[toPage]();
			}

			// [ Make sure user can't tab to offscreen elements ]
			updateTabIndex();
		}

		function updateTabIndex(){
			var page = $("#" + currPage + "Page");
			$("input").attr("tabindex",-1);
			page.find("input").removeAttr("tabindex");
		}

        $("body").on("click", ".createPO", function(){
            navigate(currPage,"purchaseOrder");
        });
	})();
    
    // [ Inserting ]
    $("#insertCustomerPage .insert").click(function(){
        var firstName   = $("#insertCustomerPage .firstName").val();
        var lastName    = $("#insertCustomerPage .lastName").val();
        var phoneNumber = $("#insertCustomerPage .phoneNumber").val();
        
        var data = {
             firstName:firstName
            ,lastName:lastName
            ,phoneNumber:phoneNumber
        }
        
        $.request("POST","/customers",data,function(){
            alert("Inserted");
        })
    })

    $("#insertProductPage .insert").click(function(){
        var orderID   = $("#insertCartPage .orderID").val();
        var prodID    = $("#insertCartPage .prodID").val();
        var quanity = $("#insertCartPage .quanity").val();

        var data = {
             orderID:orderID
            ,prodID:prodID
            ,quanity:quanity
        }

        $.request("POST","/products",data,function(){
            alert("Inserted");
        })
    })

    $("#insertOrderPage .insert").click(function(){
        var orderID   = $("#insertCartPage .orderID").val();
        var prodID    = $("#insertCartPage .prodID").val();
        var quanity = $("#insertCartPage .quanity").val();

        var data = {
             orderID:orderID
            ,prodID:prodID
            ,quanity:quanity
        }

        $.request("POST","/orders",data,function(){
            alert("Inserted");
        })
    })

    $("#insertCartPage .insert").click(function(){
        var orderID   = $("#insertCartPage .orderID").val();
        var prodID    = $("#insertCartPage .prodID").val();
        var quantity = $("#insertCartPage .quanity").val();

        var data = {
             orderID:orderID
            ,prodID:prodID
            ,quantity:quantity
        }

        $.restService.insertCart(data, function(res){
                                    alert(JSON.stringify(res));
                                },
                                function(res){
                                    alert(JSON.stringify(res));
                                })
    })

    // [Update]
    $("#deleteCartPage .delete").click(function(){
        var orderID   = $("#deleteCartPage .orderID").val();
        var prodID    = $("#deleteCartPage .prodID").val();

        var data = {
             orderID:orderID
            ,prodID:prodID
        }

        $.restService.deleteCart(data, function(res){
                                    alert(JSON.stringify(res));
                                },
                                function(res){
                                    alert(JSON.stringify(res));
                                })
    })

});

// [ Async load all the components ]
// - Declutters the head tag in index.html
// - App loads faster
(function(){
	var comps = [
		 "nav-item"
		,"customer-item"
		,"customer-list"
		,"product-item"
		,"product-list"
		,"order-item"
		,"order-list"
		,"cart-item"
		,"cart-list"
	];

	$.each(comps,function(i,name){
		$("body").append("<link rel='stylesheet' type='text/css' href='comps/" + name + "/styles.css'></link>");
	});

	$.each(comps,function(i,name){
		$("body").append("<script src='comps/" + name + "/script.js'></script>");
	});
})();

