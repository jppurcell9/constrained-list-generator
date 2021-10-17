(function() {
	var Jill = window.Jill;
	if (!Jill) {
		Jill = {};
		window.Jill = Jill;
	}
	
	var yuiDom = YAHOO.util.Dom;
	var yuiEvt = YAHOO.util.Event;
	
	Jill.Experiment5 = function() {
		this._isInitialized = false;
		
		this._alphabetTextbox = null;
		this._consonantSpan = null;
		this._vowelSpan = null;
		this._patternText = null;
		this._generateButton = null;
		this._linesTextbox = null;
		this._resultsDiv = null;
		
		this._rulesDiv = null;
		this._newRuleTextbox = null;
		this._addRuleButton = null;
		this._clearRulesButton = null;
		this._onsetVowelTextbox = null;
		this._onsetSometimesTextbox = null;
		this._onsetSometimesButton = null;
		this._codaVowelTextbox = null;
		this._codaSometimesTextbox = null;
		this._codaSometimesButton = null;
		
		
		this._consonants = null;
		this._vowels = null;
		this._rules = [];
		
		yuiEvt.onDOMReady(this.init, this, true);
	};
	
	Jill.Experiment5.prototype = {
		init: function() {
			if (!this._isInitialized) {
				var alphabetContainer = document.getElementById("alphabet");
				this._alphabetTextbox = alphabetContainer.getElementsByTagName("input")[0];
				var consonantContainer = document.getElementById("consonants");
				this._consonantSpan = consonantContainer.getElementsByTagName("span")[0];
				var vowelContainer = document.getElementById("vowels");
				this._vowelSpan = vowelContainer.getElementsByTagName("span")[0];
				this._patternText = document.getElementById("patternText");
				this._generateButton = document.getElementById("generateButton");
				this._linesTextbox = document.getElementById("linesTextbox");
				this._resultsDiv = document.getElementById("results");
				
				this._rulesDiv = document.getElementById("rules");
				this._alwaysOnsetTextbox = document.getElementById("alwaysOnsetTextbox");
				this._alwaysOnsetButton = document.getElementById("alwaysOnsetButton");
				this._alwaysCodaTextbox = document.getElementById("alwaysCodaTextbox");
				this._alwaysCodaButton = document.getElementById("alwaysCodaButton");
				this._excludeWordsTextbox = document.getElementById("excludeWordsTextbox");
				this._excludeWordsButton = document.getElementById("excludeWordsButton");
				this._onsetVowelTextbox = document.getElementById("onsetVowelTextbox");
				this._onsetSometimesTextbox = document.getElementById("onsetSometimesTextbox");
				this._onsetSometimesButton = document.getElementById("onsetSometimesButton");
				this._codaVowelTextbox = document.getElementById("codaVowelTextbox");
				this._codaSometimesTextbox = document.getElementById("codaSometimesTextbox");
				this._codaSometimesButton = document.getElementById("codaSometimesButton");
				
				
				yuiEvt.on(this._alphabetTextbox, "change", this.alphabetTextbox_change, this, true);
				yuiEvt.on(this._alphabetTextbox, "keyup", this.alphabetTextbox_change, this, true);
				yuiEvt.on(this._generateButton, "click", this.generateButton_click, this, true);
				yuiEvt.on(this._alwaysOnsetButton, "click", this.alwaysOnsetButton_click, this, true);
				yuiEvt.on(this._alwaysCodaButton, "click", this.alwaysCodaButton_click, this, true);
				yuiEvt.on(this._excludeWordsButton, "click", this.excludeWordsButton_click, this, true);
				yuiEvt.on(this._onsetSometimesButton, "click", this.onsetSometimesButton_click, this, true);
				yuiEvt.on(this._codaSometimesButton, "click", this.codaSometimesButton_click, this, true);
				
				this._isInitialized = true;
			}
		},
		
		alphabetTextbox_change: function(evt) {
			var alphabet = this._alphabetTextbox.value;
			this._consonants = [];
			this._vowels = [];
			if (alphabet.match(/^\s*[a-z]+\s*(,\s*[a-z]+\s*)*/i)) {
				var chars = alphabet.split(",");
				for (var i = 0; i < chars.length; i++) {
					if (chars[i].match(/[aeiou]/i)) {
						this._vowels.push(chars[i].replace(/(^\s*)|(\s*$)/g, ""));
					}
					else {
						this._consonants.push(chars[i].replace(/(^\s*)|(\s*$)/g, ""));
					}
				}
			}
			
			this._consonantSpan.innerHTML = this._consonants.join(", ");
			this._vowelSpan.innerHTML = this._vowels.join(", ");
			
			this.setPattern();
		},
		
		setPattern: function() {
			var lines = [];
			if (this._vowels) {
				for (var i = 0; i < this._vowels.length; i++) {
					var words = [];
					var vowel = this._vowels.length == 1 ? "[v]" : this._vowels[i];
					var wordLength = (this._consonants.length / 2);
					for (var j = 0; j < wordLength; j++) {
						letters = [];
						letters.push("[c]");
						letters.push(vowel);
						letters.push("[c]");
						words.push(letters.join(""));
					}
					lines.push(words.join(" "));
				}
			}
			this._patternText.value = lines.join("\r\n");
		},
		
		generateButton_click: function(evt) {
			var lines = [];
			var total = parseInt(this._linesTextbox.value);
			var templates = this._patternText.value.split("\n");
			while (lines.length < total) {
				for (var i = 0; i < templates.length; i++) {
					var line = null;
					var ok = false;
					while(!ok) {
						line = this.generateLine(templates[i]);
						ok = true;
						var splitLine = line.split(" ");
						for (var k = 0; k < splitLine.length; k++) {
							for (var j = 0; j < this._rules.length; j++) {
								ok = splitLine[k].match(this._rules[j]) ? true : false;
								if (!ok) {
									break;
								}
							}
							if (!ok) {
								break;
							}
						}
					}
					lines.push(line);
				}
			}
			
			this._resultsDiv.innerHTML = lines.join("<br />");
		},
		
		generateLine: function(template) {
			var cons = [];
			for (var i = 0; i < this._consonants.length; i++) {
				cons.push(this._consonants[i]);
			}
			var result = template;
			var ch;
			var index;
			while (result.match(/\[c\]/)) {
				index = Math.floor(Math.random() * cons.length);
				ch = cons[index];
				cons.splice(index, 1);
				result = result.replace(/\[c\]/, ch);
			}
			while(result.match(/\[v\]/)) {
				index = Math.floor(Math.random() * this._vowels.length);
				ch = this._vowels[index];
				result = result.replace(/\[v\]/, ch);
			}
			return result;
		},
				
		joinAllBut: function(array, separator, but) {
			var butArray = [];
			for (var i = 0; i < array.length; i++) {
				if (array[i] != but) {
					butArray.push(array[i]);
				}
			}
			return butArray.join(separator);
		},
		
		alwaysOnsetButton_click: function() {
			this._rulesDiv.innerHTML = this._rulesDiv.innerHTML + this._alwaysOnsetTextbox.value + " is always onset<br />";
			var rx = ["^\\s*("];
			rx.push(this._consonants.join("|"));
			rx.push(")(");
			rx.push(this._vowels.join("|"));
			rx.push(")(");
			rx.push(this.joinAllBut(this._consonants, "|", this._alwaysOnsetTextbox.value));
			rx.push(")\\s*$");
			this._rules.push(new RegExp(rx.join("")));
			this._alwaysOnsetTextbox.value = "";
		},
		
		alwaysCodaButton_click: function() {
			this._rulesDiv.innerHTML = this._rulesDiv.innerHTML + this._alwaysCodaTextbox.value + " is always coda<br />";
			var rx = ["^\\s*("];
			rx.push(this.joinAllBut(this._consonants, "|", this._alwaysCodaTextbox.value));
			rx.push(")(");
			rx.push(this._vowels.join("|"));
			rx.push(")(");
			rx.push(this._consonants.join("|"));
			rx.push(")\\s*$");
			this._rules.push(new RegExp(rx.join("")));
			this._alwaysCodaTextbox.value = "";
		},

		excludeWordsButton_click: function() {
			this._rulesDiv.innerHTML = this._rulesDiv.innerHTML + "Exclude these words: " + this._excludeWordsTextbox.value + "<br />";
			var rx = ["^\\s*(?!"];
			rx.push(this._excludeWordsTextbox.value.split(",").join("|").replace(/\s/g, ""));
			rx.push(")\\w+$");
			this._rules.push(new RegExp(rx.join("")));
			this._excludeWordsTextbox.value = "";
		},
		
		onsetSometimesButton_click: function() {
			var vowel = this._onsetVowelTextbox.value;
			var consonant = this._onsetSometimesTextbox.value;
			this._rulesDiv.innerHTML = this._rulesDiv.innerHTML + "When " + vowel + " is vowel, " 
				+ consonant + " is onset<br />";
			
			var rx = ["^\\s*(("];
			rx.push(this._consonants.join("|"));
			rx.push(")(");
			rx.push(vowel);
			rx.push(")(");
			rx.push(this.joinAllBut(this._consonants, "|", consonant));
			rx.push("))|((");
			rx.push(this._consonants.join("|"));
			rx.push(")(");
			rx.push(this.joinAllBut(this._vowels, "|", vowel));
			rx.push(")(");
			rx.push(this._consonants.join("|"));
			rx.push("))\\s*$");
			this._rules.push(new RegExp(rx.join("")));
			this._onsetVowelTextbox.value = "";
			this._onsetSometimesTextbox.value = "";
			
//			var goodVowels = [];
//			for (var i = 0; i < this._vowels.length; i++) {
//				if (this._vowels[i] != vowel) {
//					goodVowels.push(this._vowels[i]);
//				}
//			}
//			var rx = ["^\\s*(\\w+?["];
//			rx.push(goodVowels.join(""));
//			rx.push("]\\w+?)|(\\w+?");
//			rx.push(vowel);
//			rx.push("(?!");
//			rx.push(consonant);
//			rx.push(")\\w+?)\\s*$");
//			this._rules.push(new RegExp(rx.join("")));
//			this._onsetVowelTextbox.value = "";
//			this._onsetSometimesTextbox.value = "";
		},
		
		codaSometimesButton_click: function() {
			var vowel = this._codaVowelTextbox.value;
			var consonant = this._codaSometimesTextbox.value;
			this._rulesDiv.innerHTML = this._rulesDiv.innerHTML + "When " + vowel + " is vowel, "
				+ consonant + " is coda<br />";

			var rx = ["^\\s*(("];
			rx.push(this.joinAllBut(this._consonants, "|", consonant));
			rx.push(")(");
			rx.push(vowel);
			rx.push(")(");
			rx.push(this._consonants.join("|"));
			rx.push("))|((");
			rx.push(this._consonants.join("|"));
			rx.push(")(");
			rx.push(this.joinAllBut(this._vowels, "|", vowel));
			rx.push(")(");
			rx.push(this._consonants.join("|"));
			rx.push("))\\s*$");
			this._rules.push(new RegExp(rx.join("")));
			this._codaVowelTextbox.value = "";
			this._codaSometimesTextbox.value = "";

			//			var goodVowels = [];
//			for (var i = 0; i < this._vowels.length; i++) {
//				if (this._vowels[i] != vowel) {
//					goodVowels.push(this._vowels[i]);
//				}
//			}
//			var rx = ["^\\s*(\\w+?["];
//			rx.push(goodVowels.join(""));
//			rx.push("]\\w+?)|((?!");
//			rx.push(consonant);
//			rx.push(")\\w+?");
//			rx.push(vowel);
//			rx.push("\\w+?)\\s*$");
//			this._rules.push(new RegExp(rx.join("")));
//			this._codaVowelTextbox.value = "";
//			this._codaSometimesTextbox.value = "";
		}
	};
})();


