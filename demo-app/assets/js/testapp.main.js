//--------------------------------------------------------------------------
//  Copyright (c) 2019 Neko
//
//  This program is free software: you can redistribute it and/or modify
//  it under the terms of the GNU General Public License as published by
//  the Free Software Foundation, either version 3 of the License, or
//  (at your option) any later version.
//
//  This program is distributed in the hope that it will be useful,
//  but WITHOUT ANY WARRANTY; without even the implied warranty of
//  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
//  GNU General Public License for more details.
//
//  You should have received a copy of the GNU General Public License
//  along with this program.  If not, see <https://www.gnu.org/licenses/>.
//--------------------------------------------------------------------------

var testapp = new nekoapp({                                                                     //  Registering your application
    application : document.querySelector("test-app") ,                                          //  Main application HTML object
    applicationInfo : {                                                                         //  Application Info
        nekoappID : "0" ,																		//  ID of your app registered in Application Manager (make sure you're done that otherwise you can use 0 for testing)
        applicationTitle : "Neko Web Application Test" ,
        applicationVersion : "1.0.0" ,
        applicationURL : "//nekowebsoftware.github.io/nekoapp/"
    } ,
    applicationStylesheets : {                                                                  //  Stylesheets used for your application
        default : "/assets/css/testapp.main.css" ,												//  Default stylesheet for elements and app layout.
        colors : "/assets/css/testapp.colors.css" ,												//  Colors stylesheet with color variables
        ui : "/assets/css/testapp.ui.css"														//  User Interface stylesheet for how app will look
    } ,
    applicationClasses : {                                                                      //  Defined application HTML classes for elements
        UIButtonBackground : "testapp_ui_button_background" ,									//  Class for button background
        UIButtonContent : "testapp_ui_button_content" ,											//  Class for button content
        UIDefaultButton : "testapp_ui_default_button" ,											//  Class for default button type
        UIColorButton : "testapp_ui_color_button" ,												//  Class for color button type
        UIGlassButton : "testapp_ui_glass_button" ,												//  Class for glass button type
        UIPaneButton : "testapp_ui_pane_button" ,												//  Class for pane button type
        UICircleButton : "testapp_ui_circle_button" ,											//  Class for circle button type
		UICheckBoxIcon : "testapp_ui_checkbox_icon" ,											//  Class for checkbox icon
		UICheckBoxContent : "testapp_ui_checkbox_content" ,										//  Class for checkbox content
		UIRadioButtonIcon : "testapp_ui_radiobutton_icon" ,										//  Class for radio button icon
		UIRadioButtonContent : "testapp_ui_radiobutton_content" ,								//  Class for radio button content
        UITextBoxInput : "testapp_ui_textbox_input" ,											//  Class for textbox input
        UITextBoxStroke : "testapp_ui_textbox_stroke" ,											//  Class for textbox stroke
        UIStrokedTextBox : "testapp_ui_stroked_textbox" ,										//  Class for stroke textbox type
        UISimpleTextBox : "testapp_ui_simple_textbox" ,											//  Class for simple textbox type
        UIHighlightedTextBox : "testapp_ui_highlighted_textbox" ,								//  Class for highlighted textbox type
		UIComboBoxValue : "testapp_ui_combobox_value" ,											//  Class for combobox value
		UIComboBoxIcon : "testapp_ui_combobox_icon" ,											//  Class for combobox icon
		UIComboBoxOptions : "testapp_ui_combobox_options" ,										//  Class for combobox options
        headerContainer : "testapp_head_container" ,											//  Class for header container
		headerNavigationItem : "testapp_head_navigation_item_content" ,							//  Class for header navigation item content
		localeChangeList : "testapp_localechange_language_list" ,								//  Class for language list in locale change window
        progressBarInner : "testapp_progress_bar_inner" ,										//  Class for progress bar inner part
		rowSubtext : "testapp_row_subtext" ,													//  Class for row subtext
		localeBoxIcon : "testapp_localebox_icon" ,												//  Class for localebox icon
		localeBoxText : "testapp_localebox_text"												//  Class for localebox text
    } ,
    applicationElements : {                                                                     //  Defined custom elements for your application
        localizedStringElement : {																//  Element for localized string
            tag : "testapp-string" ,															//  Tag of your custom element
            prototype : {}																		//  Prototype of your custom element
        } ,
        graphicElement : {																		//  Element for vector graphics
            tag : "testapp-ui-graphic" ,
            prototype : {}
        } ,
        graphicsLibraryElement : {																//  Element for graphics library
            tag : "testapp-ui-graphics" ,
            prototype : {}
        } ,
        graphicsSetElement : {																	//  Element for graphics set
            tag : "testapp-graphicset" ,
            prototype : {}
        } ,
        animationElement : {																	//  Element for animation
            tag : "testapp-ui-animation" ,
            prototype : {}
        } ,
        animationSpriteElement : {																//  Element for animation sprite
            tag : "testapp-ui-animation-sprite" ,
            prototype : {}
        } ,
        UIElement : {																			//  Element for User Interface element
            tag : "testapp-ui-element" ,
            prototype : {}
        } ,
        buttonElement : {																		//  Element for button
            tag : "testapp-ui-button" ,
            prototype : {}
        } ,
        checkBoxElement : {																		//  Element for checkbox
            tag : "testapp-ui-checkbox" ,
            prototype : {}
        } ,
        radioButtonElement : {																	//  Element for radio button
            tag : "testapp-ui-radiobutton" ,
            prototype : {}
        } ,
        textBoxElement : {																		//  Element for textbox
            tag : "testapp-ui-textbox" ,
            prototype : {}
        } ,
		comboboxElement : {																		//  Element for combobox
			tag : "testapp-ui-combobox" ,
			prototype : {}
		} ,
        tooltipElement : {																		//  Element for tooltip
            tag : "testapp-ui-tooltip" ,
            prototype : {}
        } ,
        moduleElement : {																		//  Element for module
            tag : "testapp-module" ,
            prototype : {}
        } ,
        headerElement : {																		//  Element for header
            tag : "testapp-head" ,
            prototype : {}
        } ,
        footerElement : {																		//  Element for footer
            tag : "testapp-footer" ,
            prototype : {}
        } ,
        windowElement : {																		//  Element for window
            tag : "testapp-window" ,
            prototype : {}
        } ,
		windowTitle : {																			//  Element for window title
			tag : "testapp-window-title" ,
			prototype : {}
		} ,
        overlayElement : {																		//  Element for overlay
            tag : "testapp-overlay" ,
            prototype : {}
        } ,
        headerLogoElement : {																	//  Element for header logo
            tag : "testapp-logo" ,
            prototype : {}
        } ,
		headerNavigationElement : {																//  Element for header navigation
			tag : "testapp-navigation" ,
			prototype : {}
		} ,
		headerNavigationItem : {																//  Element for header navigation item
			tag : "testapp-navigation-item" ,
			prototype : {}
		} ,
        spinnerElement : {																		//  Element for spinner
            tag : "testapp-ui-spinner" ,
            prototype : {}
        } ,
        loadScreenElement : {																	//  Element for loading screen
            tag : "testapp-loading" ,
            prototype : {}
        } ,
        progressBarElement : {																	//  Element for progress bar
            tag : "testapp-progress" ,
            prototype : {}
        } ,
		headlineElement : {																		//  Element for headline
			tag : "testapp-headline" ,
			prototype : {}
		} ,
		featuresElement : {																		//  Element for features
			tag : "testapp-features" ,
			prototype : {}
		} ,
		featuresRow : {																			//  Element for features row
			tag : "testapp-features-row" ,
			prototype : {}
		} ,
		UITestElement : {																		//  Element for User Interface Test
			tag : "testapp-uitest" ,
			prototype : {}
		} ,
		UITestRow : {																			//  Element for UI Test row
			tag : "testapp-uitest-row" ,
			prototype : {}
		} ,
        introElement : {																		//  Element for introduction
            tag : "testapp-intro" ,
            prototype : {
				locale : "" ,																	//  Localization property
				loadIntro : function() {														//  Loads introduction content and appends into introduction element
					var container = this;
					nekoapp.system.xhr().load("/assets/intro/"+this.locale+".html", {			//  Performs a GET request to receive content
						onload : function() {													//  Event that appends content when loaded
							var parser = new DOMParser;
                        	var content = parser.parseFromString(this.responseText, "text/html");
                        	container.innerHTML = content.body.innerHTML;
                    	}
                	});
				}
			}
        } ,
		testElement : {																			//  Test Element
			tag : "testapp-test-element" ,
			prototype : {
				do_something : function() {														//  Asking element to do something
					this.children[1].innerHTML = "What I supposed to do?";
				} ,
				template : nekoapp.create.template(function() {									//  Creating template for test element
					var text1 = document.createElement("h3"),
						text2 = document.createElement("p");
					// To use nekoapp elements template must be created outside nekoapp constructor and before app initialization
					text1.innerHTML = "This is Test Element!";
					text2.style.fontStyle = "italic";
					text2.innerHTML = "This text was inserted here from template.";
					return [text1, text2];														//  Elements that'll be in template
				})
			}
		} ,
		localeBoxElement : {																	//  Element for locale box (change language box)
			tag : "testapp-localebox" ,
			prototype : {
				init : function() {																//  Init element
					var icon = nekoapp.create.element(testapp, "span", {						//  Locale box globe icon
							class : testapp.preferences.classes.localeBoxIcon ,
							text : nekoapp.create.graphic(testapp, "main;globe_icon", "0 0 20 20")
						}) ,
						text = nekoapp.create.element(testapp, "span", {						//  Locale box language text
							class : testapp.preferences.classes.localeBoxText
						}) ,
						event = new nekoapp.event({												//  Event to call change language window
							target : this ,
							onclick : function(object, event) {
								nekoapp.locale.openChangeWindow(testapp);						//  Calling change language window
							}
						});
					this.appendChild(icon);
					this.appendChild(text);
					event.register();															//  Registering event
					this.update();
				} ,
				update : function() {															//  Update language text (if language was changed)
					if (this.children.length) {													//  Check if locale box in initialized
						this.children[1].innerHTML = testapp.localeLanguageStrings[testapp.locale.activeLanguage];
					}
				}
			}
		}
    } ,
    applicationGraphics : {                                                                     //  SVG Graphics used for your application
        resourceName : "TESTAPP_GRAPHICS" ,
        URL : "/assets/html/testapp.graphics.html"
    } ,
	applicationAnimations : {																	//  Animations used by your application
		UIWaveAnimation : {																		//  Wave animation
			name : "testapp_ui_wave_animation" ,
			duration : 300
		} ,
		CSSVariables : {																		//  CSS Variables used by animations and UI stylesheet
			startposX : "--testapp-ui-animation-startpos-x" ,
			startposY : "--testapp-ui-animation-startpos-y" ,
			width : "--testapp-ui-animation-width" ,
			height : "--testapp-ui-animation-height"
		}
	} ,
    applicationModules : {                                                                      //  Your application modules
        testapp_intro : {																		//  Introduction module
            moduleID : "testapp_intro" ,														//  Sets as attribute in HTML
            moduleURL : "/" ,															//  URL for this module
            moduleType : "pageModule" ,															//  Type that specifies this module as page
            primaryModule : true ,																//  Sets as primary module to be changed to if no module specified in app initialization
            moduleContents : function() {														//  Function that creates module content and becomes object to access each module content element
                var elements = {																//  Module content elements that'll be accessible via JavaScript
                    intro : nekoapp.create.object(testapp, testapp.preferences.elements.introElement)
                };
                return [elements, elements.intro];												//  Returns array in which first is accessible elements and second is element(s) that'll be appended
            } ,
            onModuleChange : function(params) {													//  Function that'll be called when app changed module to this module
                if (testapp._hasInitialized) {													//  Preventing causing error
                    this.loadIntro();
				}
            } ,
			onLocaleChange : function() {														//  Function that'll be called when app changed its language
				var localebox = testapp.modules.testapp_footer.moduleContents.localebox;		//  Accessing locale box
				this.loadIntro();
				localebox.update();																//  Updating locale box
			} ,
			loadIntro : function() {															//  Function for loading introduction
				var container = this.moduleContents.intro;
                if (container.locale !== testapp.locale.activeLanguage) {
					container.locale = testapp.locale.activeLanguage;
				}
				container.loadIntro();
			}
        } ,
		testapp_features : {																	//  Features module
			moduleID : "testapp_features" ,
			moduleURL : "/#features" ,
			moduleType : "pageModule" ,
			moduleContents : function() {
				var elements = {
					features : nekoapp.create.object(testapp, testapp.preferences.elements.featuresElement) ,
					headline : nekoapp.create.object(testapp, testapp.preferences.elements.headlineElement, {
						text : nekoapp.create.localizedString(testapp, "FeaturesHeadline")
					}) ,
					descrow : nekoapp.create.object(testapp, testapp.preferences.elements.featuresRow, {
						text : nekoapp.create.element(testapp, "h3", {
							text : nekoapp.create.localizedString(testapp, "FeaturesDesc")
						})
					}) ,
					darkmode : nekoapp.create.object(testapp, testapp.preferences.elements.featuresRow) ,
					darkmodeText : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesDarkmode")
					}) ,
					darkmodeBtn : nekoapp.create.button(testapp, {
						text : nekoapp.create.localizedString(testapp, "FeaturesDarkmodeBtn") ,
						event : function(object, event) {
							nekoapp.system.darkMode.toggle();
						}
					}) ,
					darkmodeText2 : nekoapp.create.element(testapp, "p", {
						class : testapp.preferences.classes.rowSubtext ,
						text: nekoapp.create.localizedString(testapp, "FeaturesDarkmodeText2")
					}) ,
					customElements : nekoapp.create.object(testapp, testapp.preferences.elements.featuresRow) ,
					customElementsText : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesCustomElements")
					}) ,
					testElement : nekoapp.create.object(testapp, testapp.preferences.elements.testElement) ,
					customElementsText2 : nekoapp.create.element(testapp, "p", {
						class : testapp.preferences.classes.rowSubtext ,
						text: nekoapp.create.localizedString(testapp, "FeaturesCustomElementsText2")
					}) ,
					modules : nekoapp.create.object(testapp, testapp.preferences.elements.featuresRow) ,
					modulesText : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesModules")
					}) ,
					testmodule : testapp.modules.testapp_testmodule ,
					modulesPage : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesModulesPage")
					}) ,
					modulesHeader : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesModulesHeader")
					}) ,
					modulesFooter : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesModulesFooter")
					}) ,
					modulesGuide : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesModulesGuide")
					}) ,
					modulesSubtext : nekoapp.create.element(testapp, "p", {
						class : testapp.preferences.classes.rowSubtext ,
						text: nekoapp.create.localizedString(testapp, "FeaturesModulesSubtext")
					}) ,
					windows : nekoapp.create.object(testapp, testapp.preferences.elements.featuresRow) ,
					windowsText : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesWindows")
					}) ,
					windowsBtn : nekoapp.create.button(testapp, {
						text : nekoapp.create.localizedString(testapp, "FeaturesWindowsBtn") ,
						event : function(object, event) {
							nekoapp.windows.open(testapp, testapp.windows.testwindow);
						}
					}) ,
					locale : nekoapp.create.object(testapp, testapp.preferences.elements.featuresRow) ,
					localeText : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesLocale")
					}) ,
					otherfeatures : nekoapp.create.object(testapp, testapp.preferences.elements.featuresRow) ,
					otherfeaturestext : nekoapp.create.element(testapp, "p", {
						text: nekoapp.create.localizedString(testapp, "FeaturesOther")
					}) ,
					featureslinks : nekoapp.create.object(testapp, testapp.preferences.elements.featuresRow) ,
					darkModeLink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_api/system/darkMode.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "FeaturesDarkModeLink")
						})
					}) ,
					customElementsLink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_guide/preferences.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "FeaturesCustomElementsLink")
						})
					}) ,
					modulesLink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_guide/modules.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "FeaturesModulesLink")
						})
					}) ,
					windowsLink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_guide/windows.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "FeaturesWindowsLink")
						})
					}) ,
					localeLink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_guide/locale.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "FeaturesLocaleLink")
						})
					}) ,
					createLink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_api/create/object.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "FeaturesCreateLink")
						})
					}) ,
					resourceManagerLink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_api/resources.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "FeaturesResourceManagerLink")
						})
					}) ,
					xhrManagerLink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_api/system/xhr.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "FeaturesXHRManagerLink")
						})
					}) ,
                    funcCallA : nekoapp.create.button(testapp,{
                        buttonType : "default",
                        text:"Call testElement.do_something()",
                        event:function(){
                            testapp.modules.testapp_features.moduleContents.testElement.do_something();
                        }
                    }),
                    funcCallB : nekoapp.create.button(testapp,{
                        buttonType : "default",
                        text:"Call testmodule.put_something()",
                        event:function(){
                            testapp.modules.testapp_testmodule.put_something(nekoapp.create.button(testapp,{
                                buttonType:"default",
                                text:"Uh hello"
                            }));
                        }
                    }),
					funcCallC : nekoapp.create.button(testapp,{
						buttonType : "default",
						text:"Call nekoapp.create.object(testapp,testapp.preferences.elements.testElement)",
						event:function(){
							elements.customElements.appendChild(nekoapp.create.object(testapp,testapp.preferences.elements.testElement));
						}
					})
				};
				elements.features.appendChild(elements.headline);
				elements.features.appendChild(elements.descrow);
				elements.features.appendChild(elements.darkmode);
				elements.features.appendChild(elements.customElements);
				elements.features.appendChild(elements.modules);
				elements.features.appendChild(elements.windows);
				elements.features.appendChild(elements.locale);
				elements.features.appendChild(elements.otherfeatures);
				elements.features.appendChild(elements.featureslinks);
				elements.darkmode.appendChild(elements.darkmodeText);
				elements.darkmode.appendChild(elements.darkmodeBtn);
				elements.darkmode.appendChild(elements.darkmodeText2);
				elements.customElements.appendChild(elements.customElementsText);
				elements.customElements.appendChild(elements.testElement);
				//elements.customElements.appendChild(elements.funcCallA);
				elements.customElements.appendChild(elements.customElementsText2);
				//elements.customElements.appendChild(elements.funcCallC);
				elements.modules.appendChild(elements.modulesText);
				elements.modules.appendChild(elements.testmodule);
				//elements.modules.appendChild(elements.funcCallB);
				elements.modules.appendChild(elements.modulesPage);
				elements.modules.appendChild(elements.modulesHeader);
				elements.modules.appendChild(elements.modulesFooter);
				elements.modules.appendChild(elements.modulesGuide);
				elements.modules.appendChild(elements.modulesSubtext);
				elements.windows.appendChild(elements.windowsText);
				elements.windows.appendChild(elements.windowsBtn);
				elements.locale.appendChild(elements.localeText);
				elements.otherfeatures.appendChild(elements.otherfeaturestext);
				//elements.featureslinks.appendChild(elements.darkModeLink);
				//elements.featureslinks.appendChild(elements.customElementsLink);
				//elements.featureslinks.appendChild(elements.modulesLink);
				//elements.featureslinks.appendChild(elements.windowsLink);
				//elements.featureslinks.appendChild(elements.localeLink);
				//elements.featureslinks.appendChild(elements.createLink);
				//elements.featureslinks.appendChild(elements.resourceManagerLink);
				//elements.featureslinks.appendChild(elements.xhrManagerLink);
				return [elements, elements.features];
			} ,
			onModuleChange : function() {
				if(!this.moduleContents.testmodule.moduleCreated) {								//  Checking if test module isn't constructed
					this.moduleContents.testmodule.construct();									//  Construct test module
				}
			} ,
			onLocaleChange : function() {
				var localebox = testapp.modules.testapp_footer.moduleContents.localebox;
				localebox.update();
			}
		} ,
		testapp_ui : {																			//  User Interface test module
			moduleID : "testapp_ui" ,
			moduleURL : "/#ui" ,
			moduleType : "pageModule" ,
			moduleContents : function() {
				var elements = {
					uitest : nekoapp.create.object(testapp, testapp.preferences.elements.UITestElement) ,
					headline : nekoapp.create.object(testapp, testapp.preferences.elements.headlineElement, {
						text : nekoapp.create.localizedString(testapp, "UITestHeadline")
					}) ,
					descrow : nekoapp.create.object(testapp, testapp.preferences.elements.UITestRow, {
						text : nekoapp.create.element(testapp, "h3", {
							text : nekoapp.create.localizedString(testapp, "UITestDesc")
						})
					}) ,
					buttontest : nekoapp.create.object(testapp, testapp.preferences.elements.UITestRow) ,
					checkradiotest : nekoapp.create.object(testapp, testapp.preferences.elements.UITestRow) ,
					textboxtest : nekoapp.create.object(testapp, testapp.preferences.elements.UITestRow) ,
					comboboxtest : nekoapp.create.object(testapp, testapp.preferences.elements.UITestRow) ,
					buttontitle : nekoapp.create.element(testapp, "h3", {
						text : nekoapp.create.localizedString(testapp, "UITestButtons")
					}) ,
					buttondesc : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.localizedString(testapp, "UITestButtonsDesc")
					}) ,
					checkradiotitle : nekoapp.create.element(testapp, "h3", {
						text : nekoapp.create.localizedString(testapp, "UITestCheckRadio")
					}) ,
					checkradiodesc : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.localizedString(testapp, "UITestCheckRadioDesc")
					}) ,
					textboxtitle : nekoapp.create.element(testapp, "h3", {
						text : nekoapp.create.localizedString(testapp, "UITestTextBoxes")
					}) ,
					textboxdesc : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.localizedString(testapp, "UITestTextBoxesDesc")
					}) ,
                    comboboxtitle : nekoapp.create.element(testapp, "h3", {
						text : nekoapp.create.localizedString(testapp, "UITestComboBoxes")
					}) ,
					comboboxdesc : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.localizedString(testapp, "UITestComboBoxesDesc")
					}) ,
					defaultbutton : nekoapp.create.button(testapp, {
						buttonType : "default" ,
						text : "Default Button" ,
                        event : function(object, event) {
                            // The things after click happens here
                        }
					}) ,
					colorbutton : nekoapp.create.button(testapp, {
						buttonType : "color" ,
						text : "Color Button"
					}) ,
					glassbutton : nekoapp.create.button(testapp, {
						buttonType : "glass" ,
						text : "Glass Button"
					}) ,
					panebutton : nekoapp.create.button(testapp, {
						buttonType : "pane" ,
						text : "Pane Button"
					}) ,
					circlebutton : nekoapp.create.button(testapp, {
						buttonType : "circle" ,
						class : "testapp_uitest_circle_button" ,
						text: nekoapp.create.graphic(testapp, "main;heart_icon", "0 0 25 25")
					}) ,
					checkbox1 : nekoapp.create.checkbox(testapp, {
						checked : false ,
						text : "Checkbox 1" ,
                        oncheck : function(object, event) {
                            // The things after checking happens here
                        } ,
                        onuncheck : function(object, event) {
                            // The things after unchecking happens here
                        }
					}) ,
					checkbox2 : nekoapp.create.checkbox(testapp, {
						checked : true ,
						text : "Checkbox 2"
					}) ,
					radiobutton1 : nekoapp.create.radiobutton(testapp, {
						selected: true ,
						group : "testradiogroup" ,
						text : "Radio Button 1" ,
						onselect : function(object, event) {
							// The things after selecting this button happens here
						}
					}) ,
					radiobutton2 : nekoapp.create.radiobutton(testapp, {
						selected : false ,
						group : "testradiogroup" ,
						text : "Radio Button 2"
					}) ,
                    strokedtextbox : nekoapp.create.textbox(testapp, {
                        textboxType : "stroked" ,
                        placeholder : "Stroked Type Text Box" ,
                        onkeydown : function(object, event) {
                            // The things happen here after key pressing
                        } ,
                        onkeyup : function(object, event) {
                            // The things happen here after key releasing
                        }
                    }) ,
                    simpletextbox : nekoapp.create.textbox(testapp, {
                        textboxType : "simple" ,
                        placeholder : "Simple Type Text Box"
                    }) ,
                    highlightedtextbox : nekoapp.create.textbox(testapp, {
                        textboxType : "highlighted" ,
                        placeholder : "Highlighted Type Text Box"
                    }) ,
					combobox : nekoapp.create.combobox(testapp, {
						options : ["Cookies", "Donuts", "Muffins"] ,
						onselect : function(option, object, event) {
							switch(option){
								case 0 :
									// Something will happen if cookies was chosen
									break;
								case 1 :
									// Something will happen if donuts was chosen
									break;
								case 2 :
									// Something will happen if muffins was chosen
									break;
								default :
									// Something will happen if any other option was chosen
									break;
							}
						}
					}) ,
					uilinks : nekoapp.create.object(testapp, testapp.preferences.elements.UITestRow, {
						style: {
							height: "50px"
						}
					}) ,
					buttonlink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_api/create/button.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "UITestButtonLink")
						})
					}) ,
					checklink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_api/create/checkbox.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "UITestCheckLink")
						})
					}) ,
					radiolink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_api/create/radiobutton.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "UITestRadioLink")
						})
					}) ,
					textboxlink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_api/create/textbox.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "UITestTextBoxesLink")
						})
					}) ,
					comboboxlink : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.link(testapp, "/docs/nekoapp/js_api/create/combobox.html", {
							useDefaultNavigation : true ,
							target : "_blank" ,
							content : nekoapp.create.localizedString(testapp, "UITestComboBoxesLink")
						})
					}) ,
					textdiv : nekoapp.create.element(testapp, "div", {
						text : "UI Test"
					})
				};
				elements.uitest.appendChild(elements.headline);
				elements.uitest.appendChild(elements.descrow);
				elements.uitest.appendChild(elements.buttontest);
				elements.uitest.appendChild(elements.checkradiotest);
				elements.uitest.appendChild(elements.textboxtest);
				elements.uitest.appendChild(elements.comboboxtest);
				elements.uitest.appendChild(elements.uilinks);
				elements.buttontest.appendChild(elements.buttontitle);
				elements.buttontest.appendChild(elements.buttondesc);
				elements.buttontest.appendChild(elements.defaultbutton);
				elements.buttontest.appendChild(elements.colorbutton);
				elements.buttontest.appendChild(elements.glassbutton);
				elements.buttontest.appendChild(elements.panebutton);
				elements.buttontest.appendChild(elements.circlebutton);
				elements.checkradiotest.appendChild(elements.checkradiotitle);
				elements.checkradiotest.appendChild(elements.checkradiodesc);
				elements.checkradiotest.appendChild(elements.checkbox1);
				elements.checkradiotest.appendChild(elements.checkbox2);
				elements.checkradiotest.appendChild(elements.radiobutton1);
				elements.checkradiotest.appendChild(elements.radiobutton2);
				elements.textboxtest.appendChild(elements.textboxtitle);
				elements.textboxtest.appendChild(elements.textboxdesc);
                elements.textboxtest.appendChild(elements.strokedtextbox);
                elements.textboxtest.appendChild(elements.simpletextbox);
                elements.textboxtest.appendChild(elements.highlightedtextbox);
                elements.comboboxtest.appendChild(elements.comboboxtitle);
				elements.comboboxtest.appendChild(elements.comboboxdesc);
				elements.comboboxtest.appendChild(elements.combobox);
				//elements.uilinks.appendChild(elements.buttonlink);
				//elements.uilinks.appendChild(elements.checklink);
				//elements.uilinks.appendChild(elements.radiolink);
				//elements.uilinks.appendChild(elements.textboxlink);
				//elements.uilinks.appendChild(elements.comboboxlink);
				return [elements, elements.uitest];
			} ,
			onLocaleChange : function() {
				var localebox = testapp.modules.testapp_footer.moduleContents.localebox;
				localebox.update();
			}
		},
        testapp_header : {																		//  Header module
            moduleType : "headerModule" ,														//  Type that specifies this module as header
            headerLayout : {																	//  Header layout where specifies order of elements
				element0: {
					tag : "div" ,
					class : "testapp_head_navigation_container" ,
					content : {
						headerLogo : {															//  Your logo in header
                    		graphic : {															//  It's graphic
                        		graphicName : "main;test_logo" ,
                        		viewBox : "0 0 222 18"
                    		}
                		} ,
                		headerNavigation : {													//  Your navigation links in header
                    		items : [{
                        		label : "localeString@headerIntro" ,
                        		hyperlink : {
                            		URL : "/" ,
									targetModule : "testapp_intro"
                        		}
                    		}, {
                        		label : "localeString@headerFeatures" ,
                        		hyperlink : {
                            		URL : "/#features" ,
									targetModule : "testapp_features"
                        		}
                    		}, {
                        		label : "localeString@headerUI" ,
                        		hyperlink : {
                            		URL : "/#ui" ,
									targetModule : "testapp_ui"
                        		}
                    		}] ,
                    		usesBottomline : true												//  Determines bottom line as underline stroke usage in navigation
                		}
					}
				}
            }
        } ,
		testapp_footer : {																		//  Footer module
			moduleType : "footerModule" ,														//  Type that specifies this module as footer
			constructOnInit : true ,															//  Determines if footer needed to be appended in app root 
			moduleContents : function() {
				var elements = {
					container : nekoapp.create.element(testapp, "div", {
						class : "testapp_footer_container"
					}) ,
					localebox : nekoapp.create.object(testapp, testapp.preferences.elements.localeBoxElement) ,
					copyright : nekoapp.create.element(testapp, "div", {
						class: "footer_copyright" ,
						text : "&copy; Copyright S.V.G, 2019"
					})
				};
				elements.container.appendChild(elements.localebox);
				elements.container.appendChild(elements.copyright);
				return [elements, elements.container];
			}
		} ,
		testapp_testmodule : {																	//  Test Module
			moduleID : "testapp_test_module" ,
			moduleType : "simpleModule" ,														//  Type that specifies this module as simple module
			moduleContents : function() {
				var elements = {
					text1 : nekoapp.create.element(testapp, "h3", {
						text : "This is Test Module"
					}) ,
					text2 : nekoapp.create.element(testapp, "p", {
						style : {"font-style" : "italic"} ,
						text : "Want to put something here?"
					})
				};
				return [elements, [elements.text1, elements.text2]];
			} ,
			put_something : function(object) {													//  Function that puts something module (if you want?)
				this.appendChild(object);
			}
		}
    } ,
	applicationWindows : {																		//  Your application windows
		testwindow : {																			//  Test window
			windowID : "testapp_testwindow" ,													//  Sets as attribute in HTML
			windowTitle : "localeString@TestWindowTitle" ,										//  Window title
			windowContents : function() {														//  Function that creates window content and becomes object to access each window content element
				var elements = {																//  Window content elements that'll be accessible via JavaScript
					content : nekoapp.create.element(testapp, "div", {
						class : "testapp_testwindow_content"
					}) ,
					text1 : nekoapp.create.element(testapp, "h1", {
						text : nekoapp.create.localizedString(testapp, "TestWindowText1")
					}) ,
					text2 : nekoapp.create.element(testapp, "p", {
						text : nekoapp.create.localizedString(testapp, "TestWindowText2")
					})
				};
				elements.content.appendChild(elements.text1);
				elements.content.appendChild(elements.text2);
				return [elements, elements.content];											//  Returns array in which first is accessible elements and second is element(s) that'll be appended
			} ,
			onWindowOpen : function(params) {
				// The things after window opens happen here
			} ,
			onWindowClose : function() {
				// The things after window closes happen here
			}
		}
	} ,
    applicationLocalization : {                                                                 //  Your application localization
        "en-US" : {																				//  Use ISO language codes
            URL : "/assets/locale/en-us.json"											//  URL to JSON strings table
        } ,
        "ru-RU" : {
            URL : "/assets/locale/ru-ru.json"
        }
    }
});
testapp.preferences.events.onAppInit = new nekoapp.event({										//  Event that do stuff when application finishing initialization
	target : testapp ,
	oninit : function() {
		testapp.modules.testapp_footer.moduleContents.localebox.init();							//  Initializing locale box
	}
});
nekoapp.system.init(testapp);                                                                   //  Initializing yout application