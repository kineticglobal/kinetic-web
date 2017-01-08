'use strict';

app.controller('DiscussionCtrl', function ($scope, $state, loggedInUser, ForumFactory, discussion) {
  if(!loggedInUser){
    return $state.go('home');
  }
  $scope.discussion = discussion;
  const socket = io(`/${$scope.discussion._id.toString()}`); 
  socket.on('comment_created', function(newComment) {
    debugger;
    console.log('comment created!', newComment)
    if(isCommentNew(newComment)) {
      $scope.discussion.comments.push(newComment);
      $scope.$digest();
    }
  });
 
  $scope.createComment = (comment) => {
    const newComment = {
      message: comment.message,
      authorId: loggedInUser._id,
      discussionId: discussion._id,
      slackChannelId: discussion.slackChannelId,
      originCreated: 'website'
    };
    ForumFactory.createComment(newComment)
    .then(createdComment => {
      createdComment.authorId = loggedInUser;
      const socket = io();
      socket.emit('comment_created', createdComment);
    })
    .catch(err => {
      console.error(err)
    });
  }

  function isCommentNew(newComment) {
    const idx = $scope.discussion.comments.findIndex((comment) => newComment._id === comment._id);
    return idx === -1;
  }
});