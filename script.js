(function (jQuery) {
  function svgWrapper(el) {
    this._svgEl = el;
    this.__proto__ = el;
    Object.defineProperty(this, "className", {
      get: function () {
        return this._svgEl.className.baseVal;
      },
      set: function (value) {
        this._svgEl.className.baseVal = value;
      },
    });
    Object.defineProperty(this, "width", {
      get: function () {
        return this._svgEl.width.baseVal.value;
      },
      set: function (value) {
        this._svgEl.width.baseVal.value = value;
      },
    });
    Object.defineProperty(this, "height", {
      get: function () {
        return this._svgEl.height.baseVal.value;
      },
      set: function (value) {
        this._svgEl.height.baseVal.value = value;
      },
    });
    Object.defineProperty(this, "x", {
      get: function () {
        return this._svgEl.x.baseVal.value;
      },
      set: function (value) {
        this._svgEl.x.baseVal.value = value;
      },
    });
    Object.defineProperty(this, "y", {
      get: function () {
        return this._svgEl.y.baseVal.value;
      },
      set: function (value) {
        this._svgEl.y.baseVal.value = value;
      },
    });
    Object.defineProperty(this, "offsetWidth", {
      get: function () {
        return this._svgEl.width.baseVal.value;
      },
      set: function (value) {
        this._svgEl.width.baseVal.value = value;
      },
    });
    Object.defineProperty(this, "offsetHeight", {
      get: function () {
        return this._svgEl.height.baseVal.value;
      },
      set: function (value) {
        this._svgEl.height.baseVal.value = value;
      },
    });
  }

  jQuery.fn.wrapSvg = function () {
    return this.map(function (i, el) {
      if (el.namespaceURI == "http://www.w3.org/2000/svg" && !("_svgEl" in el))
        return new svgWrapper(el);
      else return el;
    });
  };
})(window.jQuery);

const debug = false;
function getType(url) {
  url = String(url);
  if (url.includes("&tbm=isch")) {
    return "images";
  } else if (url.includes("&tbm=vid")) {
    return "videos";
  } else if (
    url.includes("maps.google.com/") ||
    url.includes("google.com/maps")
  ) {
    return "maps";
  } else if (url.includes("&tbm=shop")) {
    return "shopping";
  } else if (url.includes("&tbm=nws")) {
    return "news";
  } else if (url.includes("&tbm=bks")) {
    return "books";
  } else if (url.includes("&tbm=flm")) {
    return "flights";
  } else if (url.includes("google.com/finance")) {
    return "finance";
  } else {
    return "search";
  }
}
if (debug) {
  console.log(getType(window.location));
  $("*").on("pointerenter", function () {
    if (
      !(
        ($(this).hasClass("hdtb-mitem") &&
          $(this).parent().hasClass("MUFPAc")) ||
        $(this).hasClass("ErsxPb") ||
        $(this).parent().hasClass("T47uwc")
      )
    )
      return;
    var listedCatalog = $(this).hasClass("hdtb-mitem");
    var url = "";
    var type = "";
    if ($(this).prop("tagName") == "A") {
      url = $(this).attr("href");
    } else if (listedCatalog) {
      try {
        url = $(this).children("a").eq(0).attr("href");
      } catch (error) {
        url = "error";
      }
    } else {
      try {
        url = $(this).children("a").eq(0).attr("href");
      } catch (error) {
        url = "error";
      }
    }
    if (String(url) == "undefined") url = window.location;
    type = getType(url);
    console.log("hey", type);
  });
}
//define variables
var prototypeobject0, prototypeobject1;
var items = [];

//create prototype tabs
prototypeobject0 = $(".MUFPAc").children().eq(0)[0].outerHTML;
prototypeobject1 = $(".MUFPAc").children().eq(1)[0].outerHTML;

//add listed catalogs to array
$(".MUFPAc")
  .children("div.hdtb-mitem")
  .each(function () {
    items.push({
      text:
        $(this).children("a").eq(0).prop("textContent") ||
        $(this).children("span").eq(0).prop("textContent"),
      icon:
        $(this).children("a").children("span").children()[0] ||
        $(this).children("span").children("span").children()[0],
      link: $(this).children("a").eq(0).attr("href"),
      type: getType($(this).children("a").eq(0).attr("href")),
    });
  });

//add unlisted catalogs to array
$(".cF4V5c.zriOQb.UU8UAb.gLSAk.rShyOb")
  .children()
  .children("div")
  .children("a")
  .each(function () {
    items.push({
      text: $(this).prop("textContent"),
      icon: $(this).children("span").children()[0],
      link: $(this).attr("href"),
      type: getType($(this).attr("href")),
    });
  });

//remove all tab from items
items.shift();

//define tab container
var tabs = $("#hdtb-msb").children().children().eq(0);

//delete show more button
$("#hdtb-msb").children().children().eq(1).remove();

//redefine tabs
tabs.html("");
tabs.append(prototypeobject0);
var itemcounter = 1;
function addItem(type) {
  var result;
  items.some(function (value) {
    result = value;
    return value.type == type;
  });
  var item = new DOMParser()
    .parseFromString(prototypeobject1, "text/html")
    .getElementsByTagName("div")[0];

  tabs.append(item);
  if (result == undefined) return;
  var thisitem = tabs.children().eq(itemcounter);

  thisitem.children("a").eq(0)[0].childNodes[1].textContent = result.text;
  thisitem.children("a").children("span").children()[0].outerHTML =
    result.icon.outerHTML;
  thisitem.children("a").eq(0).attr("href", result.link);
  itemcounter++;
}
chrome.storage.sync.get('cataloglist', function (data) {
  try {
    data.cataloglist.data.split(",").forEach(element => {
      addItem(element)
    });

  } catch (error) {
    addItem("images");
    addItem("videos");
    addItem("maps");
    addItem("news");
    addItem("shopping");
    addItem("books");
    addItem("flights");
    addItem("finance");
  }

});

