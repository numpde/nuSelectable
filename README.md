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
    items: 'div.blob',
    boxClass: 'nu-selection-box',
    selectedClass: 'selected',

    start: function() { },
    select: function(item) { },
    unselect: function(item) { },
    stop: function() { },

    distance: 10,
    itemsChange: true,
  });
});
```

# License
MIT/Expat
