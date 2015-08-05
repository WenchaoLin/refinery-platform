function ChartCtrl($http, $stateParams, fastQCDataService, refineryBoxPlotService, refineryC3LinePlotService) {
  var that = this;
  that.$stateParams = $stateParams;
  that.fastQCDataService = fastQCDataService;
  that.refineryBoxPlotService = refineryBoxPlotService;
  that.refineryC3LinePlotService = refineryC3LinePlotService;
}

Object.defineProperty(
  ChartCtrl.prototype,
  'data', {
    enumerable: true,
    configurable: false,
    get: function () {
      return this.fastQCDataService.data;
    }
  }
);

ChartCtrl.prototype.plot = function (fileURL) {
  var that = this;
  var config = {
    bindto: '.fastqc-chart-drawspace'
  };

  if (!this.data) {
    this.fastQCDataService.update(fileURL)
      .then(function (data) {
        if (!that.$stateParams && !that.$stateParams.mode) {
          that.draw_per_base_sequence_quality(that.data.per_base_sequence_quality, config);
        } else if (that.$stateParams.mode === 'per_base_sequence_quality') {
          that.draw_per_base_sequence_quality(that.data.per_base_sequence_quality, config);
        } else if (that.$stateParams.mode === 'per_tile_sequence_quality') {
          that.draw_per_tile_sequence_quality(that.data.per_tile_sequence_quality, config);
        } else if (that.$stateParams.mode === 'per_sequence_quality_scores') {
          that.draw_per_sequence_quality_scores(that.data.per_sequence_quality_scores, config);
        } else if (that.$stateParams.mode === 'per_base_sequence_content') {
          that.draw_per_base_sequence_content(that.data.per_base_sequence_content, config);
        } else if (that.$stateParams.mode === 'per_sequence_gc_content') {
          that.draw_per_sequence_gc_content(that.data.per_sequence_gc_content, config);
        } else if (that.$stateParams.mode === 'per_base_n_content') {
          that.draw_per_base_n_content(that.data.per_base_n_content, config);
        } else if (that.$stateParams.mode === 'sequence_length_distribution') {
          that.draw_sequence_length_distribution(that.data.sequence_length_distribution, config);
        } else if (that.$stateParams.mode === 'sequence_duplication_level') {
          that.draw_sequence_duplication_level(that.data.sequence_duplication_level, config);
        } else if (that.$stateParams.mode === 'overrepresented_sequences') {
          that.draw_overrepresented_sequences(that.data.overrepresented_sequences, config);
        } else if (that.$stateParams.mode === 'adapter_content') {
          that.draw_adapter_content(that.data.adapter_content, config);
        } else if (that.$stateParams.mode === 'kmer_content') {
          that.draw_kmer_content(that.data.kmer_content, config);
        } else {
          that.draw_per_base_sequence_quality(that.data.per_base_sequence_quality, config);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  } else {
    if (!that.$stateParams && !that.$stateParams.mode) {
      that.draw_per_base_sequence_quality(that.data.per_base_sequence_quality, config);
    } else if (that.$stateParams.mode === 'per_base_sequence_quality') {
      that.draw_per_base_sequence_quality(that.data.per_base_sequence_quality, config);
    } else if (that.$stateParams.mode === 'per_tile_sequence_quality') {
      that.draw_per_tile_sequence_quality(that.data.per_tile_sequence_quality, config);
    } else if (that.$stateParams.mode === 'per_sequence_quality_scores') {
      that.draw_per_sequence_quality_scores(that.data.per_sequence_quality_scores, config);
    } else if (that.$stateParams.mode === 'per_base_sequence_content') {
      that.draw_per_base_sequence_content(that.data.per_base_sequence_content, config);
    } else if (that.$stateParams.mode === 'per_sequence_gc_content') {
      that.draw_per_sequence_gc_content(that.data.per_sequence_gc_content, config);
    } else if (that.$stateParams.mode === 'per_base_n_content') {
      that.draw_per_base_n_content(that.data.per_base_n_content, config);
    } else if (that.$stateParams.mode === 'sequence_length_distribution') {
      that.draw_sequence_length_distribution(that.data.sequence_length_distribution, config);
    } else if (that.$stateParams.mode === 'sequence_duplication_level') {
      that.draw_sequence_duplication_level(that.data.sequence_duplication_level, config);
    } else if (that.$stateParams.mode === 'overrepresented_sequences') {
      that.draw_overrepresented_sequences(that.data.overrepresented_sequences, config);
    } else if (that.$stateParams.mode === 'adapter_content') {
      that.draw_adapter_content(that.data.adapter_content, config);
    } else if (that.$stateParams.mode === 'kmer_content') {
      that.draw_kmer_content(that.data.kmer_content, config);
    } else {
      that.draw_per_base_sequence_quality(that.data.per_base_sequence_quality, config);
    }
  }
};

ChartCtrl.prototype.draw_per_base_sequence_quality = function (data_wrapper, config) {
  var chart = this.refineryBoxPlotService.generate({
    data: data_wrapper.data,
    config: config
  });
};

ChartCtrl.prototype.draw_per_tile_sequence_quality = function (data_wrapper, config) {
  console.log("Not implemented");
};

ChartCtrl.prototype.draw_per_sequence_quality_scores = function (data_wrapper, config) {
  var chart = this.refineryC3LinePlotService.generate({
    bindto: config.bindto,
    data: {
      length: data_wrapper.data.length - 1,
      ymin: 0,
      columns: [data_wrapper.data]
    }
  });
};

ChartCtrl.prototype.draw_per_base_sequence_content = function (data_wrapper, config) {
  var chart = this.refineryC3LinePlotService.generate({
    bindto: config.bindto,
    data: {
      length: data_wrapper.data.T.length - 1,
      ymin: 0,
      ymax: 100,
      columns: [
        data_wrapper.data.T,
        data_wrapper.data.A,
        data_wrapper.data.G,
        data_wrapper.data.C
      ]
    }
  });
};


ChartCtrl.prototype.draw_per_sequence_gc_content = function (data_wrapper, config) {
  var chart = this.refineryC3LinePlotService.generate({
    bindto: config.bindto,
    data: {
      length: data_wrapper.data.length - 1,
      ymin: 0,
      columns: [
        data_wrapper.data
      ]
    }
  });
};

ChartCtrl.prototype.draw_per_base_n_content = function (data_wrapper, config) {
  var chart = this.refineryC3LinePlotService.generate({
    bindto: config.bindto,
    data: {
      length: data_wrapper.data.length - 1,
      ymin: 0,
      ymax: 100,
      columns: [
        data_wrapper.data
      ]
    }
  });
};

ChartCtrl.prototype.draw_sequence_length_distribution = function (data_wrapper, config) {

};

ChartCtrl.prototype.draw_sequence_duplication_level = function (data_wrapper, config) {
  var chart = this.refineryC3LinePlotService.generate({
    bindto: config.bindto,
    data: {
      length: data_wrapper.data.length - 1,
      ymin: 0,
      ymax: 100,
      columns: [
        data_wrapper.data
      ]
    }
  });
};

ChartCtrl.prototype.draw_overrepresented_sequences = function (data_wrapper, config) {

};

ChartCtrl.prototype.draw_adapter_content = function (data_wrapper, config) {

};

ChartCtrl.prototype.draw_kmer_content = function (data_wrapper, config) {

};


angular
  .module('refineryChart')
  .controller("refineryChartCtrl", [
    '$http',
    '$stateParams',
    'fastQCDataService',
    'refineryBoxPlotService',
    'refineryC3LinePlotService',
    ChartCtrl
  ]);


// var rawData = "##FastQC 0.11.2\n" +
// ">>Basic Statistics pass\n" +
// "#Measure Value\n" +
// "Filename 3683.2.all.fastq\n" +
// "File type Conventional base calls\n" +
// "Encoding Sanger / Illumina 1.9\n" +
// "Total Sequences 6849244\n" +
// "Sequences flagged as poor quality 0\n" +
// "Sequence length 47\n" +
// "%GC 43\n" +
// ">>END_MODULE\n" +
// ">>Per base sequence quality fail\n" +
// "#Base Mean Median Lower Quartile Upper Quartile 10th Percentile 90th Percentile\n" +
// "1 23.52669228895919 30.0 17.0 30.0 9.0 30.0\n" +
// "2 22.61769401119306 30.0 15.0 30.0 6.0 30.0\n" +
// "3 22.548314091307013 30.0 15.0 30.0 6.0 30.0\n" +
// "4 22.3950574691163 30.0 15.0 30.0 6.0 30.0\n" +
// "5 22.39572863808035 30.0 15.0 30.0 6.0 30.0\n" +
// "6 22.03295151990497 30.0 14.0 30.0 6.0 30.0\n" +
// "7 21.959946382403665 27.0 14.0 30.0 6.0 30.0\n" +
// "8 21.4081050404979 27.0 13.0 30.0 5.0 30.0\n" +
// "9 21.303325885309388 25.0 13.0 30.0 6.0 30.0\n" +
// "10 20.873027446532785 24.0 12.0 30.0 5.0 30.0\n" +
// "11 20.420678544960584 22.0 11.0 30.0 5.0 30.0\n" +
// "12 20.077596155137705 22.0 11.0 30.0 5.0 30.0\n" +
// "13 19.47769812259572 20.0 10.0 30.0 5.0 30.0\n" +
// "14 18.901000460780782 19.0 10.0 30.0 5.0 30.0\n" +
// "15 18.00319538915536 17.0 10.0 30.0 5.0 30.0\n" +
// "16 17.211532250858635 16.0 9.0 30.0 4.0 30.0\n" +
// "17 16.672872947729704 15.0 9.0 27.0 4.0 30.0\n" +
// "18 15.922716288104205 14.0 8.0 25.0 4.0 30.0\n" +
// "19 15.064888329281304 13.0 7.0 23.0 4.0 30.0\n" +
// "20 13.066084373691462 10.0 5.0 18.0 3.0 30.0\n" +
// "21 12.190382909413069 10.0 5.0 17.0 3.0 30.0\n" +
// "22 11.69559019944391 10.0 5.0 16.0 3.0 27.0\n" +
// "23 11.010061840401656 9.0 5.0 15.0 3.0 25.0\n" +
// "24 10.137235145951875 8.0 5.0 13.0 3.0 22.0\n" +
// "25 9.555501161880056 8.0 4.0 12.0 3.0 20.0\n" +
// "26 8.97474670197178 7.0 4.0 12.0 3.0 18.0\n" +
// "27 8.420876961019347 7.0 4.0 11.0 2.0 17.0\n" +
// "28 7.95904321703242 6.0 4.0 10.0 2.0 16.0\n" +
// "29 7.510181561643884 6.0 4.0 10.0 2.0 15.0\n" +
// "30 7.016723889527078 5.0 4.0 9.0 2.0 14.0\n" +
// "31 6.678151778502854 5.0 3.0 9.0 2.0 13.0\n" +
// "32 6.310239057040456 5.0 3.0 8.0 2.0 12.0\n" +
// "33 5.886876420229736 5.0 3.0 7.0 2.0 11.0\n" +
// "34 5.614893264132508 4.0 3.0 7.0 2.0 10.0\n" +
// "35 5.251853197228774 4.0 3.0 6.0 1.0 10.0\n" +
// "36 5.049513785755041 4.0 3.0 6.0 1.0 10.0\n" +
// "37 4.794182978442584 4.0 3.0 5.0 1.0 9.0\n" +
// "38 4.586312153574905 4.0 3.0 5.0 1.0 9.0\n" +
// "39 4.383426696435402 4.0 2.0 5.0 1.0 8.0\n" +
// "40 4.204505197945934 4.0 2.0 5.0 1.0 8.0\n" +
// "41 4.034213556999868 3.0 2.0 5.0 1.0 7.0\n" +
// "42 3.881523274685498 3.0 2.0 5.0 1.0 7.0\n" +
// "43 3.787205712046468 3.0 2.0 4.0 1.0 7.0\n" +
// "44 3.6438567526576655 3.0 2.0 4.0 1.0 6.0\n" +
// "45 3.537493773035389 3.0 2.0 4.0 1.0 6.0\n" +
// "46 3.417576596774768 3.0 2.0 4.0 1.0 5.0\n" +
// "47 3.8595747209473044 3.0 2.0 4.0 1.0 7.0\n" +
// ">>END_MODULE\n" +
// ">>Per tile sequence quality pass\n" +
// "#Tile Base Mean\n" +
// "2 1 0.0\n" +
// "2 2 0.0\n" +
// "2 3 0.0\n" +
// "2 4 0.0\n" +
// "2 5 0.0\n" +
// "2 6 0.0\n" +
// "2 7 0.0\n" +
// "2 8 0.0\n" +
// "2 9 0.0\n" +
// "2 10 0.0\n" +
// "2 11 0.0\n" +
// "2 12 0.0\n" +
// "2 13 0.0\n" +
// "2 14 0.0\n" +
// "2 15 0.0\n" +
// "2 16 0.0\n" +
// "2 17 0.0\n" +
// "2 18 0.0\n" +
// "2 19 0.0\n" +
// "2 20 0.0\n" +
// "2 21 0.0\n" +
// "2 22 0.0\n" +
// "2 23 0.0\n" +
// "2 24 0.0\n" +
// "2 25 0.0\n" +
// "2 26 0.0\n" +
// "2 27 0.0\n" +
// "2 28 0.0\n" +
// "2 29 0.0\n" +
// "2 30 0.0\n" +
// "2 31 0.0\n" +
// "2 32 0.0\n" +
// "2 33 0.0\n" +
// "2 34 0.0\n" +
// "2 35 0.0\n" +
// "2 36 0.0\n" +
// "2 37 0.0\n" +
// "2 38 0.0\n" +
// "2 39 0.0\n" +
// "2 40 0.0\n" +
// "2 41 0.0\n" +
// "2 42 0.0\n" +
// "2 43 0.0\n" +
// "2 44 0.0\n" +
// "2 45 0.0\n" +
// "2 46 0.0\n" +
// "2 47 0.0\n" +
// ">>END_MODULE\n" +
// ">>Per sequence quality scores fail\n" +
// "#Quality Count\n" +
// "1 109477.0\n" +
// "2 26010.0\n" +
// "3 26336.0\n" +
// "4 61954.0\n" +
// "5 147055.0\n" +
// "6 272482.0\n" +
// "7 408257.0\n" +
// "8 520733.0\n" +
// "9 595712.0\n" +
// "10 636315.0\n" +
// "11 642837.0\n" +
// "12 628293.0\n" +
// "13 594517.0\n" +
// "14 538312.0\n" +
// "15 456515.0\n" +
// "16 359933.0\n" +
// "17 268265.0\n" +
// "18 190013.0\n" +
// "19 130446.0\n" +
// "20 87387.0\n" +
// "21 57442.0\n" +
// "22 37105.0\n" +
// "23 23354.0\n" +
// "24 14418.0\n" +
// "25 8547.0\n" +
// "26 4689.0\n" +
// "27 2019.0\n" +
// "28 661.0\n" +
// "29 126.0\n" +
// "30 34.0\n" +
// ">>END_MODULE\n" +
// ">>Per base sequence content fail\n" +
// "#Base G A T C\n" +
// "1 22.010952720687502 36.9400482195618 24.62973847507755 16.419260584673147\n" +
// "2 24.411905922857674 30.45008918442408 25.303496438369166 19.83450845434908\n" +
// "3 20.59254128520005 30.57953243748036 27.605396393350386 21.22252988396921\n" +
// "4 21.7658772299278 29.174751223632946 27.67892819473493 21.380443351704326\n" +
// "5 21.426020250283905 30.164348077013415 29.23665869569918 19.172972977003496\n" +
// "6 22.22400694472279 29.939297746794463 26.265246153380804 21.571449155101938\n" +
// "7 22.895273979145312 29.681296362775573 27.876222575001165 19.54720708307795\n" +
// "8 22.20577770642327 28.845539526275022 27.705531338495142 21.243151428806563\n" +
// "9 21.611991939668105 28.58032305345739 28.373246665659252 21.43443834121526\n" +
// "10 22.369492033978734 29.345177751272594 26.283977913405586 22.001352301343086\n" +
// "11 21.980184268480123 29.417104070591048 26.8016963453587 21.80101531557013\n" +
// "12 22.43052405086745 29.250932435168135 26.69610259181247 21.622440922151938\n" +
// "13 22.144937466343556 29.68756224903613 27.072919947758184 21.09458033686213\n" +
// "14 21.980233906031618 29.56596502408242 26.938672767923812 21.515128301962154\n" +
// "15 21.68152216813577 29.328781500041863 27.20449462391312 21.785201707909245\n" +
// "16 22.108510509052966 29.35103280145956 26.82375211448328 21.716704575004197\n" +
// "17 21.793050124308547 29.141627189281106 27.19066553788363 21.87465714852672\n" +
// "18 22.23839922406185 29.21906279165867 26.677671079640515 21.864866904638966\n" +
// "19 22.14441378609373 29.340260858387317 26.864422993563743 21.65090236195521\n" +
// "20 22.014126236815038 28.747678506356213 26.987653084342462 22.25054217248629\n" +
// "21 21.84933905217159 28.88333166105161 27.188639796308262 22.07868949046854\n" +
// "22 21.811620410972704 28.920993866220808 27.07013296212321 22.19725276068328\n" +
// "23 21.69008318360617 29.027015793589328 27.18647943438393 22.096421588420572\n" +
// "24 21.75924977988902 29.020028262358842 27.096024654305022 22.12469730344711\n" +
// "25 21.542294097883723 29.17237106014171 27.15960331940641 22.125731522568156\n" +
// "26 21.60388568151757 28.998548766092387 26.99950252768662 22.398063024703426\n" +
// "27 21.46507020753595 29.004102454738305 27.14911197662368 22.38171536110207\n" +
// "28 21.649188063775252 28.82124327066377 26.9743144194924 22.555254246068582\n" +
// "29 21.455632334054076 29.200265799264898 26.98471156125625 22.35939030542477\n" +
// "30 21.506811966562942 28.81211295112492 26.90972203256091 22.771353049751227\n" +
// "31 21.370598062823504 29.32334726477896 26.677689978341302 22.628364694056238\n" +
// "32 21.5730945518136 28.85626316379056 26.826783772226605 22.743858512169236\n" +
// "33 21.159897407931933 28.713893316087724 27.01783711588584 23.108372160094508\n" +
// "34 21.300033972221165 29.147836540157375 26.667676270285938 22.88445321733552\n" +
// "35 20.622051947256974 28.87393338430223 27.158765803802975 23.345248864637817\n" +
// "36 20.736506254626814 29.1967414604457 26.787336381217276 23.279415903710206\n" +
// "37 20.244250443700214 29.054740943831924 26.961664175993853 23.73934443647401\n" +
// "38 20.21325230009677 29.254825791728756 26.683493120275703 23.84842878789877\n" +
// "39 20.005315134579646 29.25821944243675 26.801832187616114 23.934633235367496\n" +
// "40 19.688343965547688 29.01253706377109 26.914650265208923 24.384468705472294\n" +
// "41 19.31119247769047 29.233342130424138 27.07183598097641 24.383629410908984\n" +
// "42 19.20192007419411 29.30879402526294 26.99118630776858 24.49809959277437\n" +
// "43 18.919426670127308 29.806897361634398 26.709122011720588 24.564553956517706\n" +
// "44 18.42624543844566 29.949775835337718 26.750673470773517 24.873305255443103\n" +
// "45 18.1362265304643 30.311845004144693 26.60265764814529 24.94927081724572\n" +
// "46 17.76841650975606 30.362482031586552 26.336469021611308 25.532632437046075\n" +
// "47 17.544613048211318 31.49986911566831 27.41497145663918 23.540546379481196\n" +
// ">>END_MODULE\n" +
// ">>Per sequence GC content pass\n" +
// "#GC Content Count\n" +
// "0 65056.0\n" +
// "1 56837.0\n" +
// "2 48618.0\n" +
// "3 33068.0\n" +
// "4 17518.0\n" +
// "5 16231.0\n" +
// "6 14944.0\n" +
// "7 16871.5\n" +
// "8 18799.0\n" +
// "9 18799.0\n" +
// "10 24011.5\n" +
// "11 29224.0\n" +
// "12 34950.0\n" +
// "13 40676.0\n" +
// "14 46057.0\n" +
// "15 51438.0\n" +
// "16 56308.0\n" +
// "17 61178.0\n" +
// "18 66986.0\n" +
// "19 72794.0\n" +
// "20 78831.0\n" +
// "21 84868.0\n" +
// "22 94440.5\n" +
// "23 104013.0\n" +
// "24 120545.5\n" +
// "25 137078.0\n" +
// "26 137078.0\n" +
// "27 162726.5\n" +
// "28 188375.0\n" +
// "29 222137.5\n" +
// "30 255900.0\n" +
// "31 297493.5\n" +
// "32 339087.0\n" +
// "33 375735.5\n" +
// "34 412384.0\n" +
// "35 433212.5\n" +
// "36 454041.0\n" +
// "37 461144.5\n" +
// "38 468248.0\n" +
// "39 469166.0\n" +
// "40 470084.0\n" +
// "41 467953.5\n" +
// "42 465823.0\n" +
// "43 465823.0\n" +
// "44 460750.5\n" +
// "45 455678.0\n" +
// "46 446488.5\n" +
// "47 437299.0\n" +
// "48 425435.0\n" +
// "49 413571.0\n" +
// "50 395187.5\n" +
// "51 376804.0\n" +
// "52 351931.0\n" +
// "53 327058.0\n" +
// "54 299069.5\n" +
// "55 271081.0\n" +
// "56 243619.0\n" +
// "57 216157.0\n" +
// "58 216157.0\n" +
// "59 191109.5\n" +
// "60 166062.0\n" +
// "61 144362.5\n" +
// "62 122663.0\n" +
// "63 105307.0\n" +
// "64 87951.0\n" +
// "65 74396.0\n" +
// "66 60841.0\n" +
// "67 51011.0\n" +
// "68 41181.0\n" +
// "69 34261.0\n" +
// "70 27341.0\n" +
// "71 22594.5\n" +
// "72 17848.0\n" +
// "73 14728.0\n" +
// "74 11608.0\n" +
// "75 11608.0\n" +
// "76 9368.5\n" +
// "77 7129.0\n" +
// "78 5712.0\n" +
// "79 4295.0\n" +
// "80 3318.0\n" +
// "81 2341.0\n" +
// "82 1784.0\n" +
// "83 1227.0\n" +
// "84 882.5\n" +
// "85 538.0\n" +
// "86 396.0\n" +
// "87 254.0\n" +
// "88 181.0\n" +
// "89 108.0\n" +
// "90 71.5\n" +
// "91 35.0\n" +
// "92 35.0\n" +
// "93 24.0\n" +
// "94 13.0\n" +
// "95 10.5\n" +
// "96 8.0\n" +
// "97 6.0\n" +
// "98 4.0\n" +
// "99 3.5\n" +
// "100 3.0\n" +
// ">>END_MODULE\n" +
// ">>Per base N content warn\n" +
// "#Base N-Count\n" +
// "1 0.0931197662106942\n" +
// "2 2.1766343847583762\n" +
// "3 2.2791858488323675\n" +
// "4 2.660322803509409\n" +
// "5 2.09744316307026\n" +
// "6 2.014251499873563\n" +
// "7 2.0252600140979062\n" +
// "8 2.6036012149662064\n" +
// "9 1.9330454572796647\n" +
// "10 2.0971365598889453\n" +
// "11 2.0267638297014967\n" +
// "12 2.1330383324057367\n" +
// "13 2.1510841196488255\n" +
// "14 2.0348231133246237\n" +
// "15 2.341338693730286\n" +
// "16 2.417463883605256\n" +
// "17 1.9226209491149682\n" +
// "18 2.306663333938753\n" +
// "19 2.321774490732116\n" +
// "20 7.007503309854343\n" +
// "21 6.7272680021327895\n" +
// "22 6.223854778717184\n" +
// "23 6.421263427029319\n" +
// "24 6.589559373268057\n" +
// "25 6.526486718826195\n" +
// "26 6.407086679931391\n" +
// "27 6.344466630185755\n" +
// "28 6.43211133958726\n" +
// "29 6.202830560569896\n" +
// "30 6.447762701985796\n" +
// "31 6.535889216386509\n" +
// "32 6.550168164544876\n" +
// "33 7.257676905655573\n" +
// "34 6.869415077050839\n" +
// "35 7.45685217229814\n" +
// "36 7.404306227081412\n" +
// "37 7.107937751962114\n" +
// "38 7.000947841834806\n" +
// "39 6.715222877152573\n" +
// "40 6.572082991933124\n" +
// "41 6.56132268028413\n" +
// "42 7.055377206593895\n" +
// "43 6.5088935362793325\n" +
// "44 7.327830633570653\n" +
// "45 7.35532271882853\n" +
// "46 7.4409234070212715\n" +
// "47 6.130647411597543\n" +
// ">>END_MODULE\n" +
// ">>Sequence Length Distribution pass\n" +
// "#Length Count\n" +
// "47 6849244.0\n" +
// ">>END_MODULE\n" +
// ">>Sequence Duplication Levels pass\n" +
// "#Total Deduplicated Percentage 97.05452308644614\n" +
// "#Duplication Level Percentage of deduplicated Percentage of total\n" +
// "1 99.28280651808264 96.35845437296416\n" +
// "2 0.4660623952485158 0.904669269987429\n" +
// "3 0.10646985235342331 0.31000142229737504\n" +
// "4 0.04793975547156735 0.18611080416695264\n" +
// "5 0.0358161727743366 0.17380607836974976\n" +
// "6 0.008532699156572529 0.04968822283687608\n" +
// "7 0.01280661016731078 0.08700576094996659\n" +
// "8 0.006407087286935292 0.049746944080538945\n" +
// "9 0.0014246379949535218 0.012444080505394044\n" +
// ">10 0.027508542900767645 0.4514925325079162\n" +
// ">50 0.002101470380384069 0.14201868830166195\n" +
// ">100 0.0020789980089880576 0.37638103319398675\n" +
// ">500 0.0 0.0\n" +
// ">1k 0.0 0.0\n" +
// ">5k 1.5088045259059233E-5 0.110588696548554\n" +
// ">10k+ 3.017212826421728E-5 0.7875920932893675\n" +
// ">>END_MODULE\n" +
// ">>Overrepresented sequences warn\n" +
// "#Sequence Count Percentage Possible Source\n" +
// "ANNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN 33494 0.48901747404531065 No Hit\n" +
// "GNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN 20297 0.2963392748163155 No Hit\n" +
// "CNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNNN 7552 0.11026034406132997 No Hit\n" +
// ">>END_MODULE\n" +
// ">>Adapter Content pass\n" +
// "#Position Illumina Universal Adapter Illumina Small RNA Adapter Nextera Transposase Sequence\n" +
// "1 5.840060596468749E-5 0.0 1.4600151491171872E-5\n" +
// "2 8.760090894703124E-5 0.0 2.9200302982343744E-5\n" +
// "3 1.4600151491171872E-4 0.0 2.9200302982343744E-5\n" +
// "4 2.1900227236757808E-4 0.0 2.9200302982343744E-5\n" +
// "5 3.212033328057812E-4 1.4600151491171872E-5 2.9200302982343744E-5\n" +
// "6 3.5040363578812495E-4 2.9200302982343744E-5 4.380045447351562E-5\n" +
// "7 3.796039387704687E-4 2.9200302982343744E-5 4.380045447351562E-5\n" +
// "8 4.672048477174999E-4 2.9200302982343744E-5 4.380045447351562E-5\n" +
// "9 5.548057566645312E-4 2.9200302982343744E-5 5.840060596468749E-5\n" +
// "10 6.424066656115624E-4 2.9200302982343744E-5 1.022010604382031E-4\n" +
// "11 7.154074230674217E-4 2.9200302982343744E-5 1.1680121192937498E-4\n" +
// "12 7.592078775409374E-4 2.9200302982343744E-5 1.3140136342054684E-4\n" +
// "13 8.468087864879686E-4 2.9200302982343744E-5 1.3140136342054684E-4\n" +
// "14 9.052093924526561E-4 2.9200302982343744E-5 1.606016664028906E-4\n" +
// "15 9.782101499085155E-4 2.9200302982343744E-5 1.606016664028906E-4\n" +
// "16 0.0010658110588555466 2.9200302982343744E-5 1.606016664028906E-4\n" +
// "17 0.0010950113618378905 2.9200302982343744E-5 1.606016664028906E-4\n" +
// "18 0.001153411967802578 2.9200302982343744E-5 1.606016664028906E-4\n" +
// "19 0.0012264127252584374 2.9200302982343744E-5 1.606016664028906E-4\n" +
// "20 0.0013286137856966403 2.9200302982343744E-5 1.7520181789406247E-4\n" +
// "21 0.0014308148461348435 4.380045447351562E-5 1.7520181789406247E-4\n" +
// "22 0.0015768163610465622 4.380045447351562E-5 1.7520181789406247E-4\n" +
// "23 0.0016790174214847654 4.380045447351562E-5 1.7520181789406247E-4\n" +
// "24 0.0018542192393788278 4.380045447351562E-5 1.7520181789406247E-4\n" +
// "25 0.0019710204513082026 4.380045447351562E-5 1.7520181789406247E-4\n" +
// "26 0.002131622117711093 4.380045447351562E-5 2.044021208764062E-4\n" +
// "27 0.002409024996043359 4.380045447351562E-5 2.3360242385874996E-4\n" +
// "28 0.0026864278743756243 4.380045447351562E-5 2.3360242385874996E-4\n" +
// "29 0.0030222313586725775 4.380045447351562E-5 2.4820257534992183E-4\n" +
// "30 0.0033434346914783587 4.380045447351562E-5 2.774028783322656E-4\n" +
// "31 0.003766839084722343 5.840060596468749E-5 2.774028783322656E-4\n" +
// "32 0.004161043174983984 5.840060596468749E-5 2.774028783322656E-4\n" +
// "33 0.004628248022701484 5.840060596468749E-5 2.9200302982343744E-4\n" +
// "34 0.0051976539308571865 5.840060596468749E-5 3.212033328057812E-4\n" +
// "35 0.005840060596468749 5.840060596468749E-5 3.3580348429695304E-4\n" +
// ">>END_MODULE\n" +
// ">>Kmer Content warn\n" +
// "#Sequence Count PValue Obs/Exp Max Max Obs/Exp Position\n" +
// "CGTATCC 240 0.006646125 7.7999697 28\n" +
// "CGCGCGT 375 9.440403E-4 6.722237 39\n" +
// "ATACGAC 530 2.8576269E-5 6.3505106 41\n" +
// "AAATCGG 385 0.002491678 6.1683407 7\n" +
// "CTACGAC 475 0.0020672162 5.7572403 41\n" +
// "CACGCGT 580 6.599226E-4 5.4403625 41\n" +
// "CGCACGA 570 0.0031197704 5.1667533 41\n" +
// ">>END_MODULE\n";
