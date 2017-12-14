var glossaryXml = XML.load("glossary.xml");
var ownerObjectsXml = XML.load("ownerObjects.xml");
var subcontent;
var xmlFragment;
var ownerObject;
var keyword;
var currentTab = "";
var tocs = [{}];
var tocCount = 0;
GetTocFromXml = function() {
  $('#tabs ul li a')
    .each(function(i) {
      currentTab = this.innerHTML;
      
      var ownerObjects = XML.getNodes(ownerObjectsXml, "//application[@name='" + currentTab + "']/ownerObject");
      
      for (i = 0; i < ownerObjects.length; i += 1) {
        var keywordsArray = [];
        ownerObject = ownerObjects[i].getAttribute('name');
        var keywords = XML.getNodes(glossaryXml, "//application[@name='" + currentTab + "']/ownerObject[@name='" + ownerObject + "']/keyword");
        
        if (keywords && keywords.length > 0) {
          for (j = 0; j < keywords.length; j += 1)
            keywordsArray.push(keywords[j].getAttribute('name'));
          tocs[tocCount] = {
            application: currentTab,
            glossary: {
              owner: ownerObject,
              keywords: keywordsArray
            }
          };
          tocCount++;
        } else {
          tocs[tocCount] = {
            application: currentTab,
            glossary: {
              owner: ownerObject,
              keywords: null
            }
          };
          tocCount++;
        }
      }
    });
}
CreateTocList = function() {
  //Clear the contents of the tab
  $('#tabs ul li a')
    .each(function(i) {
      $(this.hash + " ul li ul li")
        .remove();
    });
  
  //Append Owners
  $('#tabs ul li a')
    .each(function(i) {
      for (c = 0; c < tocs.length; c++) {
        if (this.innerHTML == tocs[c].application)
          $(this.hash + " ul li ul")
          .append("<li><a href='#'>" + tocs[c].glossary.owner + "</a></li>");
      }
    });
  
  //Append unordered list after all owner item
  $("#tabs ul li ul li")
    .append("<ul></ul>");

  //Append keywords
  $('#tabs ul li a')
    .each(function(i) {
      for (c = 0; c < tocs.length; c++) {
        if (this.innerHTML == tocs[c].application) {
          if (tocs[c].glossary.keywords && tocs[c].glossary.keywords.length > 0) {
            for (d = 0; d < tocs[c].glossary.keywords.length; d++) {
              var owner = $(this.hash)
                .children("ul")
                .children("li")
                .children("ul")
                .children("li:contains('" + tocs[c].glossary.owner + "')")
                .children("ul");
              if (owner.length > 0)
                owner.append("<li><a href='#'>" + tocs[c].glossary.keywords[d] + "</a></li>");
            }
          }
        }
      }
    });
}
AttachTocEventListeners = function() {
  $(document)
    .ready(function() {
      $('#tabs')
        .bind('tabsselect', function(event, ui) {
          currentTab = ui.tab.innerHTML;
          var hash = ui.tab.hash;
          var firstOwnerObject = $(hash + ' li:first ul:first li:first a')
            .get(0);

          if (firstOwnerObject) {
            keyword = firstOwnerObject.innerHTML;
            subcontent = XML.getNode(ownerObjectsXml, "//application[@name='" + currentTab + "']/ownerObject[@name='" + keyword + "']");
            if (subcontent) {
              if (!window.ActiveXObject && !("ActiveXObject" in window)) {
                var serializer = new XMLSerializer();
                var xml = serializer.serializeToString(subcontent);
                xmlFragment = XML.parse(xml);
              } else { //IE
                xmlFragment = XML.parse(subcontent.xml);
              }
              XML.transform(xmlFragment, "ownerObject.xslt", "subcontents");
              $("#tabs ul ul li a")
                .css({
                  'font-weight': 'normal'
                });
              $("#tabs ul ul li a")
                .css({
                  'color': 'black'
                });
              firstOwnerObject.style.fontWeight = "bold";
              firstOwnerObject.style.color = "Red";
            }
          }
        });

      $("#tabs ul ul li")
        .click(function() {
          keyword = this.firstChild.innerHTML;
          ownerObject = $(this)
            .parents("li:first")[0].firstChild.innerHTML;
          
          if ($(this)
            .parents("li:first")[0].id.substring(0, 3) == "toc") {
            subcontent = XML.getNode(ownerObjectsXml, "//application[@name='" + currentTab + "']/ownerObject[@name='" + keyword + "']");
            
            if (!window.ActiveXObject && !("ActiveXObject" in window)) {
              var serializer = new XMLSerializer();
              var xml = serializer.serializeToString(subcontent);
              xmlFragment = XML.parse(xml);
            } else { //IE
              xmlFragment = XML.parse(subcontent.xml);
            }
            XML.transform(xmlFragment, "ownerObject.xslt", "subcontents");
          } else {
            subcontent = XML.getNode(glossaryXml, "//application[@name='" + currentTab + "']/ownerObject[@name='" + ownerObject + "']/keyword[@name='" +
              keyword + "']");
            if (!window.ActiveXObject && !("ActiveXObject" in window)) {
              var serializer = new XMLSerializer();
              var xml = serializer.serializeToString(subcontent);
              xmlFragment = XML.parse(xml);
            } else { //IE
              xmlFragment = XML.parse(subcontent.xml);
            }
            XML.transform(xmlFragment, "glossary.xslt", "subcontents");
          }

          $("#tabs ul ul li a")
            .css({
              'font-weight': 'normal'
            });
          $("#tabs ul ul li a")
            .css({
              'color': 'black'
            });
          $(this)[0].firstChild.style.fontWeight = "bold";
          $(this)[0].firstChild.style.color = "Red";
          return false; // prevent event propagation
        });
    });
}