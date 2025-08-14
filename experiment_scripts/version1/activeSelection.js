//var audio = new Audio("http://vocaroo.com/i/s1CVqVx2Uw9X");

var s = Snap(900,900);
var rect = s.rect(350,350, 200, 200,10,10);
            rect.attr({
                fill: "#FFFFFF",
                stroke: "#000",
                strokeWidth: 5
            });
var bigCircle1 = s.circle(200, 330, 100);
            bigCircle1.attr({
                fill: "#FFFFFF",
                stroke: "#000",
                strokeWidth: 5
            });
      var bigCircle2 = s.circle(700, 330, 100);
            bigCircle2.attr({
                fill: "#FFFFFF",
                stroke: "#000",
                strokeWidth: 5
            });
      var bigCircle3 = s.circle(700, 570, 100);
            bigCircle3.attr({
                fill: "#FFFFFF",
                stroke: "#000",
                strokeWidth: 5
            });
      var bigCircle4 = s.circle(200, 570, 100);
            bigCircle4.attr({
                fill: "#FFFFFF",
                stroke: "#000",
                strokeWidth: 5
            });
						
var bear = s.image("https://s32.postimg.org/k9yrvbd05/Bear_Smile.png",350,80,179,258);
var image1 = s.image("https://img.pokemondb.net/artwork/bulbasaur.jpg", 150, 280, 100,100);
var image2=s.image("https://img.pokemondb.net/artwork/squirtle.jpg", 650, 280, 100,100);
var image3 =s.image("https://img.pokemondb.net/artwork/pikachu.jpg", 650, 520, 100,100);
var image4 = s.image("https://img.pokemondb.net/artwork/charmander.jpg", 150, 520, 100,100);

image1.click(function() {
				
				this.animate({
          x: 400,
					y: 400
        },1000,mina.easeinout,function() {
				bear.attr({
	        href: "https://s32.postimg.org/ak84vihed/Bear_Talk.png"
	      });
				audio1.play();});
				//this.attr({
				//opacity:"0",
				//x: 400,
				//y: 400
				//});
				//this.animate({
				//opacity: "1"
				//},1000);
				bigCircle1.animate({
				fill: "lightblue"
				}, 1000);
				image1.unclick();
				image2.unclick();
				image3.unclick();
				image4.unclick();
				image2.animate({
				opacity: "0"
				},300);
				bigCircle2.animate({
				fill: "lightblue"
				}, 1000);
				image3.animate({
				opacity: "0"
				},300);
				bigCircle3.animate({
				fill: "lightblue"
				}, 1000);
				image4.animate({
				opacity: "0"
				},300);
				bigCircle4.animate({
				fill: "lightblue"
				}, 1000);
				});

image2.click(function() {
				
				this.animate({
          x: 400,
					y: 400
        },1000,mina.easeinout,function() {
				bear.attr({
	        href: "https://s32.postimg.org/ak84vihed/Bear_Talk.png"
	      });
				audio2.play();});
				//this.attr({
				//opacity:"0",
				//x: 400,
				//y: 400
				//});
				//this.animate({
				//opacity: "1"
				//},1000);
				bigCircle1.animate({
				fill: "lightblue"
				}, 1000);
				image1.unclick();
				image2.unclick();
				image3.unclick();
				image4.unclick();
				image1.animate({
				opacity: "0"
				},300);
				bigCircle2.animate({
				fill: "lightblue"
				}, 1000);
				image3.animate({
				opacity: "0"
				},300);
				bigCircle3.animate({
				fill: "lightblue"
				}, 1000);
				image4.animate({
				opacity: "0"
				},300);
				bigCircle4.animate({
				fill: "lightblue"
				}, 1000);
				});
		
image3.click(function() {
				
				this.animate({
          x: 400,
					y: 400
        },1000,mina.easeinout,function() {
				bear.attr({
	        href: "https://s32.postimg.org/ak84vihed/Bear_Talk.png"
	      });
				audio3.play();});
				//this.attr({
				//opacity:"0",
				//x: 400,
				//y: 400
				//});
				//this.animate({
				//opacity: "1"
				//},1000);
				bigCircle1.animate({
				fill: "lightblue"
				}, 1000);
				image1.unclick();
				image2.unclick();
				image3.unclick();
				image4.unclick();
				image1.animate({
				opacity: "0"
				},300);
				bigCircle2.animate({
				fill: "lightblue"
				}, 1000);
				image2.animate({
				opacity: "0"
				},300);
				bigCircle3.animate({
				fill: "lightblue"
				}, 1000);
				image4.animate({
				opacity: "0"
				},300);
				bigCircle4.animate({
				fill: "lightblue"
				}, 1000);
				});

image4.click(function() {
				
				this.animate({
          x: 400,
					y: 400
        },1000,mina.easeinout,function() {
				bear.attr({
	        href: "https://s32.postimg.org/ak84vihed/Bear_Talk.png"
	      });
				audio4.play();});
				//this.attr({
				//opacity:"0",
				//x: 400,
				//y: 400
				//});
				//this.animate({
				//opacity: "1"
				//},1000);
				bigCircle1.animate({
				fill: "lightblue"
				}, 1000);
				image1.unclick();
				image2.unclick();
				image3.unclick();
				image4.unclick();
				image1.animate({
				opacity: "0"
				},300);
				bigCircle2.animate({
				fill: "lightblue"
				}, 1000);
				image3.animate({
				opacity: "0"
				},300);
				bigCircle3.animate({
				fill: "lightblue"
				}, 1000);
				image2.animate({
				opacity: "0"
				},300);
				bigCircle4.animate({
				fill: "lightblue"
				}, 1000);
				});