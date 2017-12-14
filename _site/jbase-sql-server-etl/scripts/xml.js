/**
 * Source: http://www.webreference.com/programming/javascript/definitive3/index.html
 * Slightly modified for >=IE9
 */
var XML = new Object();
/**
 * Create a new Document object. If no arguments are specified,
 * the document will be empty. If a root tag is specified, the document
 * will contain that single root tag. If the root tag has a namespace
 * prefix, the second argument must specify the URL that identifies the
 * namespace.
 */
XML.newDocument = function(rootTagName, namespaceURL) {
  if (!rootTagName) rootTagName = "";
  if (!namespaceURL) namespaceURL = "";
  //document.implementation.createDocument doesn't work on Chrome and Safari.
  if (document.implementation && document.implementation.createDocument 
    //Need this because > IE8 started implementing bits and pieces of document.implementation
    && !window.ActiveXObject && !("ActiveXObject" in window)) {
    // This is the W3C standard way to do it
    return document.implementation.createDocument(namespaceURL, rootTagName, null);
  } else { // This is the IE way to do it
    // Create an empty document as an ActiveX object
    // If there is no root element, this is all we have to do
    var doc = new ActiveXObject("MSXML2.DOMDocument");
    // If there is a root tag, initialize the document
    if (rootTagName) {
      // Look for a namespace prefix
      var prefix = "";
      var tagname = rootTagName;
      var p = rootTagName.indexOf(':');
      if (p != -1) {
        prefix = rootTagName.substring(0, p);
        tagname = rootTagName.substring(p + 1);
      }
      // If we have a namespace, we must have a namespace prefix
      // If we don't have a namespace, we discard any prefix
      if (namespaceURL) {
        if (!prefix) prefix = "a0"; // What Firefox uses
      } else prefix = "";
      // Create the root element (with optional namespace) as a
      // string of text
      var text = "<" + (prefix ? (prefix + ":") : "") + tagname +
        (namespaceURL ? (" xmlns:" + prefix + '="' + namespaceURL + '"') : "") +
        "/>";
      // And parse that text into the empty document
      doc.loadXML(text);
    }
    return doc;
  }
};
/**
 * Synchronously load the XML document at the specified URL and
 * return it as a Document object
 */
XML.load = function(url) {
  // Create a new document with the previously defined function
  var xmldoc = XML.newDocument();
  xmldoc.async = false; // We want to load synchronously
  // Load and parse
  try {
    xmldoc.load(url);
  } catch (e) {
    xmldoc = XML.readxml(url);
  }
  return xmldoc; // Return the document
};
XML.readxml = function(url) {
  var xmlHttp = new window.XMLHttpRequest();
  xmlHttp.overrideMimeType('text/xml');
  xmlHttp.open("GET", url, false);
  xmlHttp.send(null);
  xmlDoc = xmlHttp.responseXML.documentElement;
  return xmlDoc
};
/**
 * Asynchronously load and parse an XML document from the specified URL.
 * When the document is ready, pass it to the specified callback function.
 * This function returns immediately with no return value.
 */
XML.loadAsync = function(url, callback) {
  var xmldoc = XML.newDocument();
  // If we created the XML document using createDocument, use
  // onload to determine when it is loaded
  if (document.implementation && document.implementation.createDocument) {
    xmldoc.onload = function() {
      callback(xmldoc);
    };
  }
  // Otherwise, use onreadystatechange as with XMLHttpRequest
  else {
    xmldoc.onreadystatechange = function() {
      if (xmldoc.readyState == 4) callback(xmldoc);
    };
  }
  // Now go start the download and parsing
  xmldoc.load(url);
};
/**
 * Parse the XML document contained in the string argument and return
 * a Document object that represents it.
 */
XML.parse = function(text) {
  if (typeof DOMParser != "undefined") {
    // Mozilla, Firefox, and related browsers
    //return (new DOMParser()).parseFromString(text, "application/xml");
    return (new DOMParser())
      .parseFromString(text == null ? "" : text, "text/xml");
  } else if (typeof ActiveXObject != "undefined") {
    // Internet Explorer.
    var doc = XML.newDocument(); // Create an empty document
    doc.loadXML(text); // Parse text into it
    return doc; // Return it
  } else {
    // As a last resort, try loading the document from a data: URL
    // This is supposed to work in Safari. Thanks to Manos Batsis and
    // his Sarissa library (sarissa.sourceforge.net) for this technique.
    var url = "data:text/xml;charset=utf-8," + encodeURIComponent(text);
    var request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);
    return request.responseXML;
  }
};
/**
 * Return a Document object that holds the contents of the <xml> tag
 * with the specified id. If the <xml> tag has a src attribute, an XML
 * document is loaded from that URL and returned instead.
 *
 * Since data islands are often looked up more than once, this function caches
 * the documents it returns.
 */
XML.getDataIsland = function(id) {
  var doc;
  // Check the cache first
  doc = XML.getDataIsland.cache[id];
  if (doc) return doc;
  // Look up the specified element
  doc = document.getElementById(id);
  // If there is a "src" attribute, fetch the Document from that URL
  var url = doc.getAttribute('src');
  if (url) {
    doc = XML.load(url);
  }
  // Otherwise, if there was no src attribute, the content of the <xml>
  // tag is the document we want to return. In Internet Explorer, doc is
  // already the document object we want. In other browsers, doc refers to
  // an HTML element, and we've got to copy the content of that element
  // into a new document object
  else if (!doc.documentElement) { // If this is not already a document...
    // First, find the document element within the <xml> tag. This is
    // the first child of the <xml> tag that is an element, rather
    // than text, comment, or processing instruction
    var docelt = doc.firstChild;
    while (docelt != null) {
      if (docelt.nodeType == 1 /*Node.ELEMENT_NODE*/ ) break;
      docelt = docelt.nextSibling;
    }
    // Create an empty document
    doc = XML.newDocument();
    // If the <xml> node had some content, import it into the new document
    if (docelt) doc.appendChild(doc.importNode(docelt, true));
  }
  // Now cache and return the document
  XML.getDataIsland.cache[id] = doc;
  return doc;
};
XML.getDataIsland.cache = {}; // Initialize the cache
/**
 * Extract data from the specified XML document and format it as an HTML table.
 * Append the table to the specified HTML element. (If element is a string,
 * it is taken as an element ID, and the named element is looked up.)
 *
 * The schema argument is a JavaScript object that specifies what data is to
 * be extracted and how it is to be displayed. The schema object must have a
 * property named "rowtag" that specifies the tag name of the XML elements that
 * contain the data for one row of the table. The schema object must also have
 * a property named "columns" that refers to an array. The elements of this
 * array specify the order and content of the columns of the table. Each
 * array element may be a string or a JavaScript object. If an element is a
 * string, that string is used as the tag name of the XML element that contains
 * table data for the column, and also as the column header for the column.
 * If an element of the columns[] array is an object, it must have one property
 * named "tagname" and one named "label". The tagname property is used to
 * extract data from the XML document and the label property is used as the
 * column header text. If the tagname begins with an @ character, it is
 * an attribute of the row element rather than a child of the row.
 */
function makeTable(xmldoc, schema, element) {
  // Create the <table> element
  var table = document.createElement("table");
  // Create the header row of <th> elements in a <tr> in a <thead>
  var thead = document.createElement("thead");
  var header = document.createElement("tr");
  for (var i = 0; i < schema.columns.length; i++) {
    var c = schema.columns[i];
    var label = (typeof c == "string") ? c : c.label;
    var cell = document.createElement("th");
    cell.appendChild(document.createTextNode(label));
    header.appendChild(cell);
  }
  // Put the header into the table
  thead.appendChild(header);
  table.appendChild(thead);
  // The remaining rows of the table go in a <tbody>
  var tbody = document.createElement("tbody");
  table.appendChild(tbody);
  // Now get the elements that contain our data from the xml document
  var xmlrows = xmldoc.getElementsByTagName(schema.rowtag);
  // Loop through these elements. Each one contains a row of the table.
  for (var r = 0; r < xmlrows.length; r++) {
    // This is the XML element that holds the data for the row
    var xmlrow = xmlrows[r];
    // Create an HTML element to display the data in the row
    var row = document.createElement("tr");
    // Loop through the columns specified by the schema object
    for (var c = 0; c < schema.columns.length; c++) {
      var sc = schema.columns[c];
      var tagname = (typeof sc == "string") ? sc : sc.tagname;
      var celltext;
      if (tagname.charAt(0) == '@') {
        // If the tagname begins with '@', it is an attribute name
        celltext = xmlrow.getAttribute(tagname.substring(1));
      } else {
        // Find the XML element that holds the data for this column
        var xmlcell = xmlrow.getElementsByTagName(tagname)[0];
        // Assume that element has a text node as its first child
        var celltext = xmlcell.firstChild.data;
      }
      // Create the HTML element for this cell
      var cell = document.createElement("td");
      // Put the text data into the HTML cell
      cell.appendChild(document.createTextNode(celltext));
      // Add the cell to the row
      row.appendChild(cell);
    }
    // And add the row to the tbody of the table
    tbody.appendChild(row);
  }
  // Set an HTML attribute on the table element by setting a property.
  // Note that in XML we must use setAttribute() instead.
  table.frame = "border";
  // Now that we've created the HTML table, add it to the specified element.
  // If that element is a string, assume it is an element ID.
  if (typeof element == "string") element = document.getElementById(element);
  element.appendChild(table);
}
/**
 * This XML.Transformer class encapsulates an XSL stylesheet.
 * If the stylesheet parameter is a URL, we load it.
 * Otherwise, we assume it is an appropriate DOM Document.
 */
XML.Transformer = function(stylesheet) {
  //Make a copy of xsl url
  this.xslSrc = stylesheet.slice();

  // Load the stylesheet if necessary.
  if (typeof stylesheet == "string") stylesheet = XML.load(stylesheet);
  this.stylesheet = stylesheet;
  // In Mozilla-based browsers, create an XSLTProcessor object and
  // tell it about the stylesheet.
  if (typeof XSLTProcessor != "undefined") {
    this.processor = new XSLTProcessor();
    this.processor.importStylesheet(this.stylesheet);
  }
};
/**
 * This is the transform() method of the XML.Transformer class.
 * It transforms the specified xml node using the encapsulated stylesheet.
 * The results of the transformation are assumed to be HTML and are used to
 * replace the content of the specified element.
 */
XML.Transformer.prototype.transform = function(node, element) {
  // If element is specified by id, look it up.
  if (typeof element == "string") element = document.getElementById(element);
  if (this.processor) {
    // If we've created an XSLTProcessor (i.e., we're in Mozilla) use it.
    // Transform the node into a DOM DocumentFragment.
    var fragment = this.processor.transformToFragment(node, document);
    // Erase the existing content of element.
    element.innerHTML = "";
    // And insert the transformed nodes.
    element.appendChild(fragment);
  } else if ("transformNode" in node) {
    // If the node has a transformNode() function (in IE), use that.
    // Note that transformNode() returns a string.
    // Only valid for (IE6, IE7, IE8)
    element.innerHTML = node.transformNode(this.stylesheet);
  } else if (window.ActiveXObject || "ActiveXObject" in window) {
    // >= IE9 Only
    var xslt = new ActiveXObject("Msxml2.XSLTemplate");
    var xslDoc = new ActiveXObject("Msxml2.FreeThreadedDOMDocument");
    xslDoc.async = false;
    xslDoc.load(this.xslSrc);
    xslt.stylesheet = xslDoc;
    var xslProc = xslt.createProcessor();
    xslProc.input = node;
    xslProc.transform();
    element.innerHTML = xslProc.output;
  }
  else {
    // Otherwise, we're out of luck.
    throw "XSLT is not supported in this browser";
  }
};
/**
 * This is an XSLT utility function that is useful when a stylesheet is
 * used only once.
 */
XML.transform = function(xmldoc, stylesheet, element) {
  var transformer = new XML.Transformer(stylesheet);
  transformer.transform(xmldoc, element);
}
/**
 * XML.XPathExpression is a class that encapsulates an XPath query and its
 * associated namespace prefix-to-URL mapping. Once an XML.XPathExpression
 * object has been created, it can be evaluated one or more times (in one
 * or more contexts) using the getNode() or getNodes() methods.
 *
 * The first argument to this constructor is the text of the XPath expression.
 *
 * If the expression includes any XML namespaces, the second argument must
 * be a JavaScript object that maps namespace prefixes to the URLs that define
 * those namespaces. The properties of this object are the prefixes, and
 * the values of those properties are the URLs.
 */
XML.XPathExpression = function(context, xpathText, namespaces) {
  this.xpathText = xpathText; // Save the text of the expression
  this.namespaces = namespaces; // And the namespace mapping
  if (document.createExpression) {
    // If we're in a W3C-compliant browser, use the W3C API
    // to compile the text of the XPath query
    this.xpathExpr =
      document.createExpression(xpathText,
        // This function is passed a 
        // namespace prefix and returns the URL.
        function(prefix) {
          return namespaces[prefix];
        });
    /*
    if (/Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent)) { //test for Firefox/x.x or Firefox x.x (ignoring remaining digits);
        var ffversion = new Number(RegExp.$1) // capture x.x portion and store as a number
        if (ffversion >= 3) {
            this.xpathExpr = context.createExpression(xpathText,
                                  function(prefix) {
                                      return namespaces[prefix];
                                  });   
        }
        else if (ffversion >= 2) {
            this.xpathExpr =
            document.createExpression(xpathText, // This function is passed a
            // namespace prefix and returns the URL.
                                  function(prefix) {
                                      return namespaces[prefix];
                                  });
        }
    }
    */
  } else {
    // Otherwise, we assume for now that we're in IE and convert the
    // namespaces object into the textual form that IE requires.
    this.namespaceString = "";
    if (namespaces != null) {
      for (var prefix in namespaces) {
        // Add a space if there is already something there
        if (this.namespaceString) this.namespaceString += ' ';
        // And add the namespace
        this.namespaceString += 'xmlns:' + prefix + '="' +
          namespaces[prefix] + '"';
      }
    }
  }
};
/**
 * This is the getNodes() method of XML.XPathExpression. It evaluates the
 * XPath expression in the specified context. The context argument should
 * be a Document or Element object. The return value is an array
 * or array-like object containing the nodes that match the expression.
 */
XML.XPathExpression.prototype.getNodes = function(context) {
    if (this.xpathExpr) {
      // If we are in a W3C-compliant browser, we compiled the
      // expression in the constructor. We now evaluate that compiled
      // expression in the specified context.
      var result =
        this.xpathExpr.evaluate(context,
          // This is the result type we want
          XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
          null);
      // Copy the results we get into an array.
      var a = new Array(result.snapshotLength);
      for (var i = 0; i < result.snapshotLength; i++) {
        a[i] = result.snapshotItem(i);
      }
      return a;
    } else {
      // If we are not in a W3C-compliant browser, attempt to evaluate
      // the expression using the IE API.
      try {
        // We need the Document object to specify namespaces
        var doc = context.ownerDocument;
        // If the context doesn't have ownerDocument, it is the Document
        if (doc == null) doc = context;
        // This is IE-specific magic to specify prefix-to-URL mapping
        doc.setProperty("SelectionLanguage", "XPath");
        doc.setProperty("SelectionNamespaces", this.namespaceString);
        // In IE, the context must be an Element not a Document,
        // so if context is a document, use documentElement instead
        if (context == doc) context = doc.documentElement;
        // Now use the IE method selectNodes() to evaluate the expression
        return context.selectNodes(this.xpathText);
      } catch (e) {
        // If the IE API doesn't work, we just give up
        throw "XPath not supported by this browser.";
      }
    }
  }
  /**
   * This is the getNode() method of XML.XPathExpression. It evaluates the
   * XPath expression in the specified context and returns a single matching
   * node (or null if no node matches). If more than one node matches,
   * this method returns the first one in the document.
   * The implementation differs from getNodes() only in the return type.
   */
XML.XPathExpression.prototype.getNode = function(context) {
  if (this.xpathExpr) {
    var result =
      this.xpathExpr.evaluate(context,
        // We just want the first match
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null);
    return result.singleNodeValue;
  } else {
    try {
      var doc = context.ownerDocument;
      if (doc == null) doc = context;
      doc.setProperty("SelectionLanguage", "XPath");
      doc.setProperty("SelectionNamespaces", this.namespaceString);
      if (context == doc) context = doc.documentElement;
      // In IE call selectSingleNode instead of selectNodes
      return context.selectSingleNode(this.xpathText);
    } catch (e) {
      throw "XPath not supported by this browser.";
    }
  }
};
// A utility to create an XML.XPathExpression and call getNodes() on it
XML.getNodes = function(context, xpathExpr, namespaces) {
  return (new XML.XPathExpression(context, xpathExpr, namespaces))
    .getNodes(context);
};
// A utility to create an XML.XPathExpression and call getNode() on it
XML.getNode = function(context, xpathExpr, namespaces) {
  return (new XML.XPathExpression(context, xpathExpr, namespaces))
    .getNode(context);
};