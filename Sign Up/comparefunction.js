var ItemComparator = (function()
{
    // Global Constants
	var MIN_ITEMS = 2;
		var MAX_ITEMS = 4;
	
    // Private Variables
    var keys = [];
    var idx = 0; // loop variable

    // Private methods
    function addToCompare(item_key)
    {
        if (! item_key) return;
        item_key = item_key.toUpperCase();
        for (idx = 0; idx < keys.length; idx++)
        {
            // Already here?
            if (keys[idx] == item_key) return;
        }
        // New, so add
        keys.push(item_key);
		setCookie();
    }

    function removeFromCompare(item_key)
    {
        if (! item_key) return;
        item_key = item_key.toUpperCase();
        for (idx = 0; idx < keys.length; idx++)
        {
            if (keys[idx] == item_key)
            {
                // Create new copy of keys without specified item
                keys = keys.slice(0, idx).concat(keys.slice(idx + 1));
				setCookie();
                return;
            };
        }
    }
	
	function setCookie()
	{
		var now = new Date();
		var time = now.getTime();
		var expireTime = time + (5 * 60 * 1000);
		now.setTime(expireTime);
		document.cookie = 'item_keys='+JSON.stringify(keys)+';cookie=ok;expires='+now.toGMTString()+';path=/';
	}

    function toggleVisibility(element)
    {
        if (! element) return;
        if (-1 != element.className.indexOf("hidden"))
        {
            element.className = element.className.replace("hidden", "");
        }
        else
        {
            element.className += " hidden";
        }
    }

    function toggleSpanTags(checkbox)
    {
        if (! checkbox) return;
        // 1) Find sibling <label>'s
        // 2) Toggle each <span> inside <label>
        var siblings = checkbox.parentNode.childNodes;
        for (var idx = 0; idx < siblings.length; idx++)
        {
            if ("LABEL" != siblings[idx].tagName) continue;
            var label = siblings[idx];

            for (var sub_idx = 0; sub_idx < label.childNodes.length; sub_idx++)
            {
                var el = label.childNodes[sub_idx];
                if ("SPAN" != el.tagName) continue;

                toggleVisibility(el);
            }
        }        
    }

    // return object
    var comparator = {};

    // public
    comparator.compare = function()
    {
        if (keys.length < MIN_ITEMS)
        {
            alert("You must select at least " + MIN_ITEMS + " items to compare");
            return;
        }
        if (keys.length > MAX_ITEMS)
        {
            alert("You cannot select more than " + MAX_ITEMS + " items to compare");
            return;
        }

		var old_keys = keys;
		keys = [];
		setCookie();
        document.location = '/_CGI/COMPARE.HTML?PN=' + old_keys.join('|');
    }

    comparator.toggleCompare = function(checkbox, item_key)
    {
        if (! checkbox || ! item_key) return;
        if (checkbox.checked)
        {
            addToCompare(item_key);
        }
        else
        {
            removeFromCompare(item_key);
        }
        toggleSpanTags(checkbox);
    }
	
	function getCompareCookie()
	{
		return (document.cookie.match(/^(?:.*;)?\s*item_keys\s*=\s*([^;]+)(?:.*)?$/)||[,null])[1]
	}

    comparator.scanForCheckedCompares = function()
    {
		var cookie = getCompareCookie();
		if (cookie == null)
		{
			//Need anything here?
		}
		else 
		{
			keys = JSON.parse(cookie);
		}

        var inputs = document.getElementsByTagName("input");
        for (var idx = 0; idx < inputs.length; idx++)
        {
            var input = inputs[idx];
            if ("checkbox" == input.type)
            {
                // Assume default state is unchecked
                if (input.checked)
                {
                    input.onclick();
                }
            }
        }
    }
    return comparator;
})();

// Expose global functions
var compare = ItemComparator.compare;
var toggleCompare = ItemComparator.toggleCompare;

// Scan for already checked items (set by browser in refresh or back button) and set appropriately
$(document).ready(ItemComparator.scanForCheckedCompares);


