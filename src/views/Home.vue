<template>
  <v-col sm="12">
    <v-row>
      <v-col>
        <v-row>
          <v-col v-for="(element, index) in IngredientsArray" :key="index">
            <v-card
              id="cards"
              class="mx-auto text-center"
              min-height="220"
              max-height="240"
              min-width="200"
              max-width="2000"
            >
              <v-card-title class="deep-purple lighten-5" id="title">{{element.ingredients_name}}</v-card-title>
              <hr>
              <v-spacer/>
              <v-card-text id="qty">{{element.ingredients_remaining}} {{element.ingredients_unit}}/s</v-card-text>
              <v-chip :color="getColor(element.ingredients_status)">{{element.ingredients_status}}</v-chip>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <template>
      <div>
        <br>
        <h4 class="letter">UBE HALAYA IN A JAR SALES</h4>
      </div>
      <br>
      <v-row>
        <v-col sm="6" class="d-flex filter">
          <v-select
            :items="Dates"
            v-model="filterBy"
            @change="filtering"
            label=" Filter by"
            dense
            class="dropdownFilter"
          ></v-select>
          <v-select
            label="Year"
            v-model="filterByDate"
            @change="filtering"
            :items="Years"
            dense
            class="dropdownFilter"
            :disabled="(filterBy.toLowerCase() === 'yearly' ) ? true : false "
          ></v-select>
        </v-col>
        <v-col sm="12">
          <v-card>
            <Graph type="area" height="400px" :options="chartOptions" :series="series"></Graph>
          </v-card>
        </v-col>
        <v-col>
          <div class="text-center">
            <v-pagination
              v-model="page"
              :length="12"
              :total-visible="7"
              circle
              v-if="filterBy !== 'Yearly' && filterBy !== 'Monthly'  && filterBy !== 'Weekly'"
              @input="pageChange"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </template>
    <br>
    <br>
    <br>
    <template>
      <div >
       <h4 class="letter">UBE HALAYA IN A TUB SALES</h4>
      </div>
      <br>
      <v-row>
        <v-col sm="6" class="d-flex filter">
          <v-select
            :items="Dates"
            v-model="filterByTubs"
            @change="filteringTubs"
            label=" Filter by"
            dense
            class="dropdownFilter"
          ></v-select>
          <v-select
            label="Year"
            v-model="filterByDateTubs"
            @change="filteringTubs"
            :items="Years"
            dense
            class="dropdownFilter"
            :disabled="(filterByTubs.toLowerCase() === 'yearly' ) ? true : false "
          ></v-select>
        </v-col>
        <v-col sm="12">
          <v-card>
            <Graph type="area" height="400px" :options="chartOptionsTubs" :series="seriesJarTubs"></Graph>
          </v-card>
        </v-col>
        <v-col>
          <div class="text-center">                                                       
            <v-pagination
              v-model="pageTubs"
              :length="12"
              :total-visible="7"
              data-toggle="tooltip" 
              data-placement="bottom"
              circle
              v-if="filterByTubs !== 'Yearly' && filterByTubs !== 'Monthly' && filterByTubs !== 'Weekly'" 
              @input="pageChangeTubs"
            ></v-pagination>
          </div>
        </v-col>
      </v-row>
    </template>
  </v-col>
</template>
<script>
import Graph from "vue-apexcharts";
import axios from "axios";
import moment from 'moment';
import VueMoment from 'vue-moment';
export default {
  data() {
    return {
      page: new Date().getMonth() + 1,
      pageTubs: new Date().getMonth() + 1,
      IngredientsArray: [],
      Dates: ["Daily", "Weekly", "Monthly", "Yearly"],
      Years: [],
      series: [],
      chartOptions: {},
      chartOptionsTubs: {},
      seriesJarTubs: [],


      filterBy: "Daily",
      filterByTubs: "Daily",
      filterByDate: new Date().getFullYear(),
      filterByDateTubs: new Date().getFullYear(),
      // config:{}
    };
  },
  components: {
    Graph
  },
  beforeCreate() {
    let config = {};
    config.headers = {
      Authorization: "Bearer " + localStorage.getItem("token"),
      "Access-Control-Allow-Origin": "*"
    };
    this.config = config;
  },
  created() {
    this.filterByYear();
    this.daily();
    this.dailyTubs();
    this.fetchIngredients();
    this.weekCount(12 );

  },
  methods: {
    getColor(status) {
      if (status === "Alert! Very Low") return "red";
      else if (status === "Warning! Running Low") return "orange";
      else if (status === "Calculating...") return "blue";
      else return "green";
    },
    fetchIngredients() {
      this.$vloading.show();
      axios
        .get(this.url+"/api/fetch/stock", this.config)
        .then(response => {
          setTimeout(() => {
        this.$vloading.hide()
         },1000) 
          let results = [];
          for (var i = 0; i < response.data.length; i++) {
            if (this.containsObject(results, response.data[i].id)) {
            } else {
              results.push(response.data[i]);
              this.IngredientsArray = results;
            }
            continue;
          }
        });
    },
    containsObject(arr, id) {
      return arr.some(function(el) {
        return el.id === id;
      });
    },
    initializeData(category, series) {
      this.series = [
        {
          name: "Sales",
          data: series, // serries
          color: "rgb(177, 117, 235)"
        }
      ];

      this.chartOptions = {
        chart: {
          height: 350,
          type: "area",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 6
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          align: "left",
          text: "Sold Ube in Jars"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        yaxis: {
          title: {
            text: "T o t a l"
          }
        },
        xaxis: {
          categories: category, // categories,
          title: {
            text: this.clickTitle()
          }
        }
      };
    },
    initializeDataTubs(categoryTubs, seriesTubs) {
      this.seriesJarTubs = [
        {
          name: "Sales",
          data: seriesTubs, // serries
          color: "rgb(177, 117, 235)"
        }
      ];

      this.chartOptionsTubs = {
        chart: {
          height: 350,
          type: "area",
          zoom: {
            enabled: false
          }
        },
        dataLabels: {
          enabled: false
        },
        markers: {
          size: 6
        },
        stroke: {
          curve: "smooth"
        },
        title: {
          align: "left",
          text: "Sold Ube in Tubs"
        },
        grid: {
          row: {
            colors: ["#f3f3f3", "transparent"], // takes an array which will be repeated on columns
            opacity: 0.5
          }
        },
        yaxis: {
          title: {
            text: "T o t a l"
          }
        },
        xaxis: {
          categories: categoryTubs, // categories,
          title: {
            text: this.clickTitleTubs()
          }
        }
      };
    },
     weekCount (month) {
    month = moment(month, 'YYYY-MM-DD');

    var first = month.day() == 0 ? 6 : month.day()-1;
    var day = 7-first;

    var last = month.daysInMonth();
    var count = (last-day)/7;

    var weeks = [];
    weeks.push([1, day]);
    for (var i=0; i < count; i++) {
        weeks.push([(day+1), (Math.min(day+=7, last))]);

    }
    return weeks;
},
    
    dailyTubs(){
      let parameter = {
        year : this.filterByDateTubs,
        month : this.pageTubs
      };
      axios.post(this.url+"/api/sales/dailyTubs", parameter, this.config).then(response=>{
        setTimeout(() => {
         },1000)   
        let category = [];
        let series = [];

        if(response.data.length > 0){
          response.data.forEach(element =>{
            category.push((new Date(element.preferred_delivery_date)).toISOString().split('T')[0]);
            series.push(element.total);
          });
          this.initializeDataTubs(category, series);
        }else{
          let year = this.filterByDateTubs;
          let month = String(this.pageTubs);
          let days= "";
          let lastday = Number(
            new Date(new Date(year,month,1)-1).getDate()
            );
            if (month.length === 1){
              month = "0" + month;
            }
            for (var i = 1; i < lastday + 1; i++) {
              let days = String(i);
              if (days.length === 1) {
                days = "0" + days;
              }
              category.push(year + "-" + month + "-" + days);
              series.push(0);
            }
            this.initializeDataTubs(category, series);
        }
      })
    },
    daily() {
      /**
       * get the necessary DAILY DATA on mounted
       */
      let parameter = {
        year: this.filterByDate,
        month: this.page
      };
      axios
        .post(this.url+"/api/sales/daily", parameter, this.config)
        .then(response => {
          let category = [];
          let series = [];
          if (response.data.length > 0) {
            response.data.forEach(element => {
              // (new Date(element.preferred_delivery_date)).toISOString().split('T')[0]
              category.push((new Date(element.preferred_delivery_date)).toISOString().split('T')[0]);
              series.push(element.total);
            });
            this.initializeData(category, series);
          } else {
            let year = this.filterByDate;
            let month = String(this.page);
            let days = "";
            let lastday = Number(
              new Date(new Date(year, month, 1) - 1).getDate()
            );
            if (month.length === 1) {
              month = "0" + month;
            }
            for (var i = 1; i < lastday + 1; i++) {
              let days = String(i);
              if (days.length === 1) {
                days = "0" + days;
              }
              category.push(year + "-" + month + "-" + days);
              series.push(0);
            }
            this.initializeData(category, series);
          }
        });
    },
    filtering() {
      /**
       * when the filter by is clicked this method is called
       */
      let graphFilter = this.filterBy;
      switch (graphFilter) {
        case "Daily":
          this.daily();
          break;
        case "Weekly":
          this.weekly();
          break;
        case "Monthly":
          this.monthly();
          break;
        case "Yearly":
          this.yearly();
          break;
      }
    },
     filteringTubs() {
      /**
       * when the filter by is clicked this method is called
       */
      let graphFilter = this.filterByTubs;
      switch (graphFilter) {
        case "Daily":
          this.dailyTubs();
          break;
        case "Weekly":
          this.weeklyTubs();
          break;
        case "Monthly":
          this.monthlyTubs();
          break;
        case "Yearly":
          this.yearlyTubs();
          break;
      }
    },
    weekly() {
      // 'w' + (index + 1)
      let parameter = {
        year: this.filterByDate
      };
      axios
        .post(this.url+"/api/sales/weekly", parameter, this.config)
        .then(response => {
          let weeklyCategory = [];
          let weeklySeries = [];
          let data = response.data;
          console.log(response.data);
          if (data.length > 0) {
            data.forEach((element, index) => {
              if (element[0].totals === null) {
                weeklySeries.push(0);
                weeklyCategory.push("Week" + (index + 1));
              } else {
                weeklyCategory.push("Week" + (index + 1));
                weeklySeries.push(element[0].totals);
              }
            });
            this.initializeData(weeklyCategory, weeklySeries);
            console.log("Weekly Sales"+weeklySeries)
          }
        });
    },
    weeklyTubs() {
      // 'w' + (index + 1)
      let parameter = {
        year: this.filterByDateTubs
      };
      axios
        .post(this.url+"/api/sales/weeklyTubs", parameter, this.config)
        .then(response => {
          let weeklyCategory = [];
          let weeklySeries = [];
          let data = response.data;
          if (data.length > 0) {
            data.forEach((element, index) => {
              if (element[0].totals === null) {
                weeklySeries.push(0);
                weeklyCategory.push("Week" + (index + 1));
              } else {
                weeklyCategory.push("Week" + (index + 1));
                weeklySeries.push(element[0].totals);
              }
            });
            this.initializeDataTubs(weeklyCategory, weeklySeries);
          }
        });
    },
    monthly() {
      let parameter = {
        year: this.filterByDate
      };
      axios
        .post(this.url+"/api/sales/monthly", parameter, this.config)
        .then(response => {
          let monthlyCategory = [];
          let monthlySeries = [];
          let WordMonths = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ];
          let data = response.data;
          if (data.length > 0) {
            data.forEach(element => {
              let ConverttoNumber = Number(element.months) - 1;
              monthlyCategory.push(WordMonths[ConverttoNumber]);
              monthlySeries.push(element.totals);
            });
            this.initializeData(monthlyCategory, monthlySeries);
          }
        });
    },
    monthlyTubs() {
      let parameter = {
        year: this.filterByDateTubs
      };
      axios
        .post(this.url+"/api/sales/monthlyTubs", parameter, this.config)
        .then(response => {
          let monthlyCategory = [];
          let monthlySeries = [];
          let WordMonths = [
            "January",
            "February",
            "March",
            "April",
            "May",
            "June",
            "July",
            "August",
            "September",
            "October",
            "November",
            "December"
          ];
          let data = response.data;
          if (data.length > 0) {
            data.forEach(element => {
              let ConverttoNumber = Number(element.months) - 1;
              monthlyCategory.push(WordMonths[ConverttoNumber]);
              monthlySeries.push(element.totals);
            });
            this.initializeDataTubs(monthlyCategory, monthlySeries);
          }
        });
    },
    yearly() {
      axios
        .get(this.url+"/api/sales/yearly", this.config)
        .then(response => {
          let yearlyCategory = [];
          let yearlySeries = [];
          let data = response.data;
          if (data.length > 0) {
            data.forEach(element => {
              yearlyCategory.push(element.years);
              yearlySeries.push(element.totals);

            });
            this.initializeData(yearlyCategory, yearlySeries);

          }
        });
    },
    yearlyTubs() {
      axios
        .get(this.url+"/api/sales/yearlyTubs", this.config)
        .then(response => {
          let yearlyCategory = [];
          let yearlySeries = [];
          let data = response.data;
          if (data.length > 0) {
            data.forEach(element => {
              yearlyCategory.push(element.years);
              yearlySeries.push(element.totals);

            });
            this.initializeDataTubs(yearlyCategory, yearlySeries);
          }
        });
    },
    filterByYear() {
      axios
        .get(this.url+"/api/sales/filterYear", this.config)
        .then(response => { 
          let tempYears = [];
          response.data.forEach(element => {
            tempYears.push(element.years);
          });
          this.Years = tempYears;
        });
    },
    pageChange() {
      this.filtering();
    },
    clickTitle() {
      if (this.filterBy == "Daily") {
        return "Days";
      } else if (this.filterBy == "Monthly") {
        return "Months";
      } else if (this.filterBy == "Weekly") {
        return "Weeks";
      } else if (this.filterBy == "Yearly") {
        return "Years";
      }
    },
    pageChangeTubs() {
      this.filteringTubs();
    },
    clickTitleTubs() {
      if (this.filterByTubs == "Daily") {
        return "Days";
      } else if (this.filterByTubs == "Monthly") {
        return "Months";
      } else if (this.filterByTubs == "Weekly") {
        return "Weeks";
      } else if (this.filterByTubs == "Yearly") {
        return "Years";
      }
    }
  }
};
</script>

<style scoped>
.letter{
  color: #673ab7 !important;
}
.filter {
  padding-bottom: 0px !important;
  margin-bottom: 0px !important;
}
.dropdownFilter {
  margin-bottom: 0px !important;
  height: 43px;
  margin-left: 2%;
}
#title {
  justify-content: center;
}
#qty {
  font-weight: bold;
}
#cards {
  border: 1px solid;
  border-color: purple;
  border-radius: 10px;
}
</style>
