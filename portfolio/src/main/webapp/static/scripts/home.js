const windowLoadHandlerHome = () => {
  setTimeout(() => {
    document.querySelector(".LI-profile-pic").src =
        "https://media-exp1.licdn.com/dms/image/C5603AQGDOaDSpoTQ6g/profile-displayphoto-shrink_200_200/"
        + "0?e=1596672000&v=beta&t=EiqH2TCfBNn58UQGlNgMf8MXUSLj0YTAqRDYsMEoefc";
  }, 1000);
}
window.addEventListener("load",windowLoadHandlerHome);

let navBar = document.querySelector(".nav-bar#top-nav");

function scrollEvent(scrollPos) {
  let elementAtPageCenter = document.elementFromPoint(window.innerWidth/2,window.innerHeight/2);
  let block = elementAtPageCenter;
  if (scrollPos === 0) {
    block = null;
  }
  while (block && !block.classList.contains("content-block")) {
    block = block.parentElement;
  }


  let current = navBar.querySelector(".active");
  if (current != null) {
    current.classList.remove("active");
  }

  if (block) {
    let navID = "nav-" + block.id;
    let activeNavItem = navBar.querySelector("#"+navID);
    activeNavItem.className += " active";
  }
}

//requestAnimationFrame is used to limit the frequency of function calls on every scroll event
let lastScrollPos = 0;
let ticking = false;
window.addEventListener('scroll', function(e) {
  lastScrollPos = window.scrollY;

  if (!ticking) {
    window.requestAnimationFrame(function() {
      scrollEvent(lastScrollPos);
      ticking = false;
    });

    ticking = true;
  }
});


const drawProgrammmingExperienceChart = () => {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Language');
  data.addColumn('number', 'Years');
  data.addRows([
    ['Java', 6],
    ['Python', 5],
    ['C/C++', 2],
    ['Javascript', 2]
  ]);

  const options = {
    'title': 'Programming Language Experience (Years)',
    'width': 500,
    'height': 400,
    'backgroundColor': { fill: 'transparent' }
  };

  const chart = new google.visualization.PieChart(
      document.getElementById('experience-chart-container'));
  chart.draw(data, options);
}

const drawTimeDistributionChart = () => {
  const data = new google.visualization.DataTable();
  data.addColumn('string', 'Activity');
  data.addColumn('number', 'Time');
  data.addRows([
    ['Sleeping', 8],
    ['Coding', 7.5],
    ['Eating', 2],
    ['YouTube', 3],
    ['Watching Movies/TV', 3.5]
  ]);

  const options = {
    'title': 'What I Do In A Day (Hours)',
    'width': 500,
    'height': 400,
    'backgroundColor': { fill: 'transparent' }
  };

  const chart = new google.visualization.PieChart(
      document.getElementById('activities-chart-container'));
  chart.draw(data, options);
}

const drawCharts = () => {
  drawProgrammmingExperienceChart();
  drawTimeDistributionChart();
}

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawCharts);
