angular.module('my-app')
.controller('my-ctrl', ['$scope', function($scope) {
  $scope.init = function() {
    console.clear();
    $scope.df1 = {};
    $scope.table1= {};
    $scope.config1 = {
      config: {
        id: "tableid1",
        width: 370,
        height: 100,
        edit: true,
        pk: "ID",
        dialogTitle: 'Dialog Title wre',
        dialogWidth:500,
        dialogHeight:400,
        footer:[{name:"Teest",color:"red"}],
        save: function() {
          var elist = {
            dt0: "mana",
            dt2: "kana",
            dt4: "sana",
            dtmessage: "valla!"
          };
          $scope.df1.validate(elist);
          console.log("save", $scope.df1);
        },
        remove: function() {
          var elist = {
            dt1: "mana",
            dt3: "kana",
            dt5: "sana",
            dterror: "malla!"
          };
          $scope.df1.validate(elist);
          console.log("remove", $scope.df1);
        }
      },
      table: [{
        width: 70,
        ewidth: 220,
        map: "One",
        header: "hOne",
        type: 'text',
        required: true,
        readonly: false,
        hidden: false,
        color: 'red',
        align: 'right',
        server: 'side-----------',
        dcolor: "DColor"

      }, {
        width: 30,
        ewidth: 500,
        map: "DropVal",
        mask: 'DropName',
        required: true,
        header: "hTwo",
        type: 'drop',
        drop: 'dropmenu1'
      }, {
        width: 70,
        //ewidth:300,
        map: "DropVal2",
        mask: 'DropName2',
        required: true,
        header: "hDrop2",
        type: 'drop',
        drop: 'dropmenu2'
      }, {
        width: 30,
        map: "Date",
        header: "Date",
        type: 'date'
      }, {
        width: 30,
        map: "Textarea",
        header: "Textarea",
        type: 'textarea',
        //col:20,
        row: 2
      }, {
        width: 30,
        map: "Label",
        header: "Label",
        type: 'label'
      }]
    };
    $scope.dropmenu1 = {
      dropmenu1: [{
        label: 'Odin',
        value: 1,
        dt1: 'red'
      }, {
        label: 'Dva',
        value: 2,
        dt1: 'green'
      }],
      dropmenu2: [{
        label: 'Bir',
        value: 1
      }, {
        label: 'Eki',
        value: 2
      }]
    };
  };

  $scope.view = function() {
    $scope.df1.fullName = "Taladak";
    $scope.df1.sid = [54,56];
    $scope.df1.footer0 = 10;
   

    $scope.table1 = {
      RowCount: 2,
      One: [10, 20],
      ID: [1000, 1001],
      Date: ['1/1/2012', ''],
      DColor: ['green', 'blue'],
      Textarea: ['text1 ', 'text2'],
      Label: ['label1', 'label2'],
      DropName: ['Odin', 'Dva'],
      DropVal: [1, 2],
      DropName2: ['Bir', 'Eki'],
      DropVal2: [1, 2],
      index: [1, 2]
    };
  };


  $scope.viewnone = function() {
    $scope.table1 = undefined;
     $scope.df1.footer0 = undefined;
  };



}]);