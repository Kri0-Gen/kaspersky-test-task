'use strict';

angular.
  module('userList').
  component('userList', {
    templateUrl: 'user-list/user-list.template.html',
    controller: ['UsersFactory', function userListController(UsersFactory) {
      var self = this,

      // функция обновляет список пользователей с учётом фильтрации, сортировки и режима отображения
         updateList = function(){
           UsersFactory.getUsers().$promise.then(function(fullUserList){
             self.totalCount = fullUserList.length;
             if (self.filter){
               // фильтруем
               var regExp = new RegExp(self.filter.toLowerCase().replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"));
               fullUserList = fullUserList.filter(function(user) {
                 return (user.fullName && regExp.test(user.fullName.toLowerCase()))
                    || (user.phone && regExp.test(user.phone.toLowerCase()))
                    || (user.email && regExp.test(user.email.toLowerCase()));
               });
             }
             self.filteredCount = fullUserList.length;
             if (self.mode === 'groups'){
               self.groups = [];
               var groupHashMap = {};
               // разбираем на списки по группам, только для режима вывода по группам
               for(var i = 0, l = fullUserList.length; i < l; i++){
                 var user = fullUserList[i];
                 if (!groupHashMap[user.group]){
                   groupHashMap[user.group] = [];
                 }
                 groupHashMap[user.group].push(user);
               }
               // ng-repeat не умеет сортировать объект по ключу, конвертим в массив (а если не сортировать - группы будут прыгать при фильтрации)
               for (var groupName in groupHashMap){
                 if (groupHashMap.hasOwnProperty(groupName)){
                   self.groups.push({
                     name: groupName,
                     users: groupHashMap[groupName]
                   });
                 }
               }
             }
             if (self.sorting !== 'none'){
               // сортируем
               var sortFn = function(a, b) {
                 return (a[self.sorting] > b[self.sorting]) ? 1 : -1;
               };
               if (self.mode === 'groups'){
                 for (var j = 0, len = self.groups.length; j < len; j++){
                     self.groups[j].users.sort(sortFn);
                 }
               }
               else {
                 fullUserList.sort(sortFn);
               }
             }
             self.users = fullUserList;
           });
         };

      this.users = [];
      this.totalCount = this.filteredCount = null;
      UsersFactory.getUsers().$promise.then(function(userList){
        self.users = userList;
        self.totalCount = self.filteredCount = userList.length;
      });
      this.mode = 'list';
      this.filter = '';
      this.sorting = 'none';
      this.groups = [];

      this.getSetMode = function getSetMode(val){
        if (val){
          self.mode = val;
          updateList();
        }
        return self.mode;
      };
      this.getSetSorting = function getSetSorting(val){
        if (val){
          this.sorting = val;
          updateList();
        }
        return self.sorting;
      };
      this.setFilter = function setFilter(val){
        if (val !== undefined){
          self.filter = val;
          updateList();
        }
        return self.filter;
      };
    }]
  });
