(function(){
	var app = angular.module('myapp');
	app.controller('mainCtrl',function($scope,$timeout,$filter,$http,moviestore,mfilterstore,$stateParams){ 	
		
		//控制
		var mfilter  = mfilterstore.filter;
		var movies = $scope.movies = moviestore.movies;
		var limit = 5;
		$scope.nowPage=$stateParams.page?+$stateParams.page:0;
		$scope.tmpmovies=$scope.movies;
		$scope.NextPage = function(){
			var next = ++$scope.nowPage;
			moviestore.get(next*limit);
		};
		$scope.PrevPage = function(){
			var prev = --$scope.nowPage;
			moviestore.get(prev*limit);
		};
		$scope.AddPv = function(idx){
			movies[limit*$scope.nowPage+idx].pv++;
			moviestore.save();
		};

		var cping = $scope.cping = [];
		$scope.Ping = function(idx,ptype){
			if(cping[idx]){ return;} //判断是否已经为评价过了的
			switch(ptype){
				case 'good':
					movies[limit*$scope.nowPage+idx].pgood++; //limit*$scope.nowPage+idx 根据我自己的规则，下一页是直接在原有数组上面直接加数组，所以，当前页面的movie的索引就要加上前面的页数的索引
				break;
				case 'bad':
					movies[limit*$scope.nowPage+idx].pbad++;
				break;
			};
			console.log();
			cping[idx] = 'cant'; // 因为这里的cping的索引是相对于当前页面元素显示个数，然而他的$index等于这个movie在movies里面的索引，所以要减去前面的movie数据的个数
			//angular.element(document.querySelector('.bgood')).attr;
			moviestore.save();
			mfilterstore.savePing(movies[limit*$scope.nowPage+idx]['_id']);
		};
		$scope.$watch('movies',function(newval,oldval){
			angular.copy([],cping);
			for(var m=limit*$scope.nowPage;m<movies.length;m++){
				for(var p=0;p<mfilter.ping.length;p++){
					if(movies[m]._id === mfilter.ping[p]){
						(function(m){
							$timeout(function(){
								cping[m%5] = 'cant'; //因为cping的idx值是当前页面的，而我每个页面的movie的个数是5个，所以要进行求余
							},0);
						})(m)
					}
				}
			}
		},true);

		$scope.$watch('nowPage',function(n,o){
			console.log('nowPage: '+n);
		});
	});
})();