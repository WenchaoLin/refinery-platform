angular.module('refineryDataFileUpload', ['blueimp.fileupload'])

.config([
  '$httpProvider', 'fileUploadProvider',
  function ($httpProvider, fileUploadProvider) {
    "use strict";
    // file upload settings:
    angular.extend(fileUploadProvider.defaults, {
    //  maxChunkSize: chunkSize,
    //  sequentialUploads: true,
    //  autoUpload: false,
    //  formData: getFormData,
    //  chunkdone: chunkDone,
    //  submit: uploadSubmit,
    //  done: uploadDone,
    });
  }
])

.controller('RefineryFileUploadController', [
  '$scope', '$http', '$filter', '$window',
  function ($scope, $http) {
    "use strict";
    $scope.options = {
      url: url,
      maxChunkSize: chunkSize,
      sequentialUploads: true,
      autoUpload: false,
      formData: getFormData,
      chunkdone: chunkDone,
      done: uploadDone,
      processQueue: [
        {
          action: 'calculate_checksum',
          acceptFileTypes: '@'
        }
      ]
    };
    $scope.loadingFiles = false;
    $.blueimp.fileupload.prototype.processActions = {
      calculate_checksum: function (data, options) {
        var dfd = $.Deferred();
        var file = data.files[data.index];
        calculate_md5(file, chunkSize, dfd, this);
        return dfd.promise();
      }
    };
    function calculate_md5(file, chunk_size, dfd, context) {
      var slice = File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice,
          chunks = Math.ceil(file.size / chunk_size),
          current_chunk = 0,
          spark = new SparkMD5.ArrayBuffer();
      function onload(e) {
        spark.append(e.target.result);  // append chunk
        current_chunk++;
        if (current_chunk < chunks) {
          read_next_chunk();
        } else {
          md5[file.name] = spark.end();
          dfd.resolveWith(context, [data]);
        }
      }
      function read_next_chunk() {
        var reader = new FileReader();
        reader.onload = onload;
        var start = current_chunk * chunk_size,
            end = Math.min(start + chunk_size, file.size);
        reader.readAsArrayBuffer(slice.call(file, start, end));
      }
      console.log("Calculating checksum of " + file.name);
      read_next_chunk();
    }
  }
])

.controller('RefineryFileDestroyController', [
  '$scope', '$http',
  function ($scope, $http) {
    "use strict";
    var file = $scope.file,
        state;
    if (file.url) {
      file.$state = function () {
        return state;
      };
      file.$destroy = function () {
        state = 'pending';
        return $http({
          url: file.deleteUrl,
          method: file.deleteType
        }).then(
            function () {
              state = 'resolved';
              $scope.clear(file);
            },
            function () {
              state = 'rejected';
            }
        );
      };
    } else if (!file.$cancel && !file._index) {
      file.$cancel = function () {
        $scope.clear(file);
      };
    }
  }
]);

var url = '/data_set_manager/import/chunked-upload/',
    chunkSize = 10 * 1000 * 1000,  // bytes
    md5 = {},  // dictionary of file names and hash values
    csrf = "",
    formData = [];
    if ($("input[name='csrfmiddlewaretoken']")[0]) {
      csrf = $("input[name='csrfmiddlewaretoken']")[0].value;
      formData = [{"name": "csrfmiddlewaretoken", "value": csrf}];
    }

var getFormData = function(form) {
  "use strict";
  return formData;
};

var chunkDone = function(e, data) {
  "use strict";
  if (formData.length < 2) {
    formData.push({"name": "upload_id", "value": data.result.upload_id});
  }
};

var uploadDone = function(e, data) {
  "use strict";
  console.log(
      "Finished uploading chunks for:", data.files[0].name,
      "md5 =", md5[data.files[0].name]);
  $.ajax({
    type: "POST",
    url: "/data_set_manager/import/chunked-upload-complete/",
    data: {
        csrfmiddlewaretoken: csrf,
        upload_id: data.result.upload_id,
        md5: md5[data.files[0].name]
    },
    dataType: "json",
    success: function(data) {
      console.log(data);
    }
  });
  formData.splice(1);  // clear upload_id for the next upload
};