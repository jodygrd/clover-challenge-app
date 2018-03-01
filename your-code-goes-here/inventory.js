document.addEventListener("DOMContentLoaded", function(event) { 

  var app = new Vue({
    el: '#inventory',
    data: {
      loaded: false,
      inventory: [],
      inventoryStocks: [],
      newItemName: '',
      newItemQuantity: '',
      selectedItem: '',
      chartData: [],
      combinedInventory: [],
      // chartColors: ['#EA4335', '#84B0F8'],
      nameSorted: false,
      quantitySorted: false,
      isChevronDown: true,
      chevronHTML: '<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>'
    },
    mounted: function() {
      //get item names
      var api_url = "https://apisandbox.dev.clover.com:443/v3/merchants/5JR8C0AKERFHG/items?access_token=547e386a-6c78-aa08-bc21-3a3a771d2eb4";
      $.get(api_url,function(result) {
        this.inventory = result["elements"];
      }.bind(this));
      //get item stocks
      var stocks_url = "https://apisandbox.dev.clover.com:443/v3/merchants/5JR8C0AKERFHG/item_stocks?access_token=547e386a-6c78-aa08-bc21-3a3a771d2eb4"
      $.get(stocks_url,function(result) {
        this.inventoryStocks = result["elements"];
        //create combined inventory array
        for (var i=0; i < this.inventory.length; i++){
          var object = {};
          object["id"] = this.inventory[i]["id"];
          object["name"] = this.inventory[i]["name"];
          object["stockCount"] = this.inventoryStocks[i]["stockCount"];
          this.combinedInventory.push(object);
        }
        //create chart array
        for (var i=0; i < this.combinedInventory.length; i++){
          this.chartData.push([this.combinedInventory[i]["name"], this.combinedInventory[i]["stockCount"]]);
        }
        //create inventory array
      }.bind(this));
      
    },
    methods: {
      selectItem: function(itemId) {
        var api_url = "https://apisandbox.dev.clover.com:443/v3/merchants/5JR8C0AKERFHG/items/" + itemId + "?access_token=a6461488-12fc-e39d-7a79-d37af35bbafd";
        $.get(api_url,function(result) {
          this.selectedItem = result;
          console.log(this.selectedItem);
        }.bind(this));
      },
      sortByName: function() {
        if (this.nameSorted === false) {
          this.combinedInventory.sort(function(a,b) {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
          });
          this.nameSorted = true ;
          this.quantitySorted = false;
        } else {
          this.combinedInventory.reverse();
          this.nameSorted = true;
          this.quantitySorted = false;
          this.swapChevron();
          console.log(this.chevronDirection)
          // this.chevronDirection = '<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>'
        }
        
        console.log("sorted by name")
      },
      swapChevron: function(){
        if (this.isChevronDown === true){
          this.isChevronDown = false;
          this.chevronHTML = '<span class="glyphicon glyphicon-chevron-up" aria-hidden="true"></span>'
        } else {
          this.isChevronDown = true;
          this.chevronHTML = '<span class="glyphicon glyphicon-chevron-down" aria-hidden="true"></span>'
        }
      },
      sortByStock: function(){
        if (this.quantitySorted === false) {
          this.combinedInventory.sort((a , b) => a.stockCount - b.stockCount );
          this.quantitySorted = true 
          this.nameSorted = false
        } else {
          this.combinedInventory.reverse();
          this.nameSorted = false
        }

        console.log("sorted by stock")
      },
      addItem: function() {
        var params = {
          name: this.newItemName,
          itemStock: this.newItemQuantity,
        };
        var api_url = "https://apisandbox.dev.clover.com:443/v3/merchants/5JR8C0AKERFHG/items?access_token=a6461488-12fc-e39d-7a79-d37af35bbafd";
        $.post(api_url, params, function(result){
          console.log(result);
          this.inventory.push(result);
          this.newItemName = '';
          this.newItemQuantity =''
        }.bind(this))
      },
      editItem: function() {
        var params = {
          name: this.newItemName,
          itemStock: this.newItemQuantity,
        };
        var api_url = "https://apisandbox.dev.clover.com:443/v3/merchants/5JR8C0AKERFHG/items/" + this.selectedItem.id + "?access_token=a6461488-12fc-e39d-7a79-d37af35bbafd";
        $.post(api_url, params, function(result){
          console.log(result);
          this.inventory.push(result);
          this.newItemName = '';
          this.newItemQuantity =''
        }.bind(this))
      },
      deleteItem: function() {
        var api_url = "https://apisandbox.dev.clover.com:443/v3/merchants/5JR8C0AKERFHG/items/" + this.selectedItem.id + "?access_token=a6461488-12fc-e39d-7a79-d37af35bbafd";
        $.ajax({
          type: 'post',
          data: {_method: 'delete'},
          url: api_url
        })
      },
    }
  });
});

