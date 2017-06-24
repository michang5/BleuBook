$("#header__button").click(function() {
	$(this).toggleClass("hamburger--open");
});
$(function () {
	$('[href="#top"], [href="#sport-1"], [href="#sport-2"], [href="#sport-3"]').click(function () {
		if ($(this).attr('href') == '#') {} else {
			$('html, body').animate({
				scrollTop: $($(this).attr('href')).offset().top - 50
			}, 500);
			return false;
		}
	});
});
$(function () {
	var addClass = function (elem, className) {
		if (elem.classList) {
			elem.classList.add(className);
		} else {
			elem.className += ' ' + className;
		}
	};

	var removeClass = function (elem, className) {
		if (elem.classList) {
			elem.classList.remove(className);
		} else {
			elem.className = elem.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
		}
	};

	var hasClass = function (elem, className) {
		return new RegExp('(\\s|^)' + className + '(\\s|$)').test(elem.className);
	};

	var quantityMinus = document.getElementById('quantity-minus') ? document.getElementById('quantity-minus') : false;

	var quantityInput = document.getElementById('quantity-input-text') ? document.getElementById('quantity-input-text') : false;

	var quantityPlus = document.getElementById('quantity-plus') ? document.getElementById('quantity-plus') : false;

	var quantityAddCart = document.getElementById('quantity-add-cart') ? document.getElementById('quantity-add-cart') : false;

	var cartIcon = document.getElementById('cart-icon') ? document.getElementById('cart-icon') : false;
	var cartIconCount = document.getElementById('cart-icon-count') ? document.getElementById('cart-icon-count') : false;
	var quantityCounter = 0;

	var cartContainer = document.getElementById('cart-container') ? document.getElementById('cart-container') : false;

	var cartSummary = document.getElementById('cart-summary') ? document.getElementById('cart-summary') : false;

	var cartSummaryItem = document.getElementById('cart-summary-item') ? document.getElementById('cart-summary-item') : false;

	var cartSummaryCountInput = document.getElementById('cart-summary-count-input') ? document.getElementById('cart-summary-count-input') : false;

	var cartSummaryNoItems = document.getElementById('cart-summary-no-items') ? document.getElementById('cart-summary-no-items') : false;

	var cartSummaryRemove = document.getElementById('cart-summary-remove') ? document.getElementById('cart-summary-remove') : false;

	var checkoutButton = document.getElementById('checkout-button') ? document.getElementById('checkout-button') : false;

	var checkIfZero = function (num) {
		if (num === 0) {
			return true;
		} else {
			return false;
		}
	};

	if (quantityPlus) {
		quantityPlus.addEventListener("click", function () {
			quantityCounter++;
			console.log(quantityCounter);
			quantityInput.innerHTML = quantityCounter;
			if (hasClass(quantityAddCart, "add-cart-null")) {
				removeClass(quantityAddCart, "add-cart-null");
			}
		});
	}
	if (quantityMinus) {
		quantityMinus.addEventListener("click", function () {
			if (quantityCounter > 0) {
				quantityCounter--;
				quantityInput.innerHTML = quantityCounter;
			}
			if (checkIfZero(quantityCounter) && !hasClass(quantityAddCart, "add-cart-null")) {
				addClass(quantityAddCart, "add-cart-null");
			}
		});
	}

	if (quantityAddCart) {
		quantityAddCart.addEventListener('click', function () {
			if (quantityCounter > 0) {
				if (cartSummaryItem.style.display != "block") {

					cartSummaryItem.style.display = "block";
					cartSummaryItem.style.opacity = 1;

					if (cartSummaryNoItems.display != "none") {
						Velocity(cartSummaryNoItems, "fadeOut");
					}

				}

				Velocity(cartIcon, "callout.pulse", {
					complete: function () {
						cartIconCount.innerHTML = quantityCounter;
						cartSummaryCountInput.value = quantityCounter;
					}
				});
				checkoutButton.style.display = "block";
			}

		});
	}

	if (cartContainer) {
		cartContainer.addEventListener('click', function () {
			console.log(this.style.display);
			if (cartSummary.style.display != "block") {
				Velocity(cartSummary, "slideDown");
			} else {
				Velocity(cartSummary, "slideUp");
			}
		});
	}

	if (cartSummaryRemove) {
		cartSummaryRemove.addEventListener('click', function () {
			Velocity(cartSummaryItem, "fadeOut", {
				complete: function () {
					Velocity(cartSummaryNoItems, "fadeIn");
				}
			});
			quantityCounter = 0;
			cartIconCount.innerHTML = quantityCounter;
			cartSummaryCountInput.value = quantityCounter;
			quantityInput.innerHTML = quantityCounter;
			addClass(quantityAddCart, "add-cart-null");
			checkoutButton.style.display = "none";
		});
	}

	if (checkoutButton) {
		checkoutButton.addEventListener('click', function () {
			alert("Order Placed");
		});
	}
	});
$(".carousel").swipe({
  swipe: function(event, direction, distance, duration, fingerCount, fingerData) {

    if (direction == 'left') $(this).carousel('next');
    if (direction == 'right') $(this).carousel('prev');

  },
  allowPageScroll:"vertical"

});
window.onscroll = function(){
	var target = document.body;	
	var top_btn = document.querySelector('#top-btn');	
	var y = target.scrollTop,
    offset = 200; 
        
	if( y >= offset){
		top_btn.setAttribute('class', 'fixed');
      
	} else {
		top_btn.removeAttribute('class');
	}
}
