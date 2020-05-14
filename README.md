# nuSelectable
Lightweight alternative to jQuery Selectable. 
Originally inspired by Google Drive file select.

![Selection](https://imgur.com/TYNp1Lp.jpg)

# Example
``` css
.nu-selection-box {
  border: 1px dotted #BBB;
  background: rgba(0, 0, 0, 0.04);
  pointer-events: none;
}
```
``` javascript
$(function() {
  $("#container").nuSelectable({
    boxClass: 'nu-selection-box',
    
    // jQuery to identify selectable items
    items: 'div.blob',
    
    // Remove/add this class to items upon un/selection
    selectedClass: 'selected',

    start: function() { },
    select: function(item) { },
    unselect: function(item) { },
    stop: function() { },

    // Mouse travel before selection box appears
    distance: 10,
    
    // Retrieve list of items at each click
    itemsChange: true,
  });
});
```

# License
MIT/Expat
