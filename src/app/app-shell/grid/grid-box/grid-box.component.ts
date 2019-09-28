import { Component, Input, ViewChild, ElementRef, AfterViewInit } from '@angular/core';

import { Chart } from 'chart.js';

@Component({
	selector: 'app-grid-box',
	templateUrl: './grid-box.component.html',
	styleUrls: ['./grid-box.component.css']
})
export class GridBoxComponent implements AfterViewInit {
	
	@Input() filename: number;
	@Input() header: string;
	@Input() labels: Object[];
	@Input() image: string;

	@ViewChild('chart', { static: false }) chartCanvas: ElementRef;
	private chart: Chart;
	
	constructor() { }
	
	ngAfterViewInit() {
		this.initializeChart()
	}

	handleTabChange(event) {
		if(event.nextId === "vision")
		{
			setTimeout(() => {
				this.initializeChart();
			}, 0);
		}
		else
		{

		}
	}
	
	initializeChart() {

		this.chart = new Chart(this.chartCanvas.nativeElement, {
			type: 'horizontalBar',
			data: {
				labels: this.labels.map(label => label['description']),
				datasets: [{
					label: 'Likelihood',
					data: this.labels.map(label => label['score']),
					backgroundColor: [
						'rgba(255, 99, 132, 0.2)',
						'rgba(54, 162, 235, 0.2)',
						'rgba(255, 206, 86, 0.2)',
						'rgba(75, 192, 192, 0.2)',
						'rgba(153, 102, 255, 0.2)',
						'rgba(255, 159, 64, 0.2)'
					],
					borderColor: [
						'rgba(255, 99, 132, 1)',
						'rgba(54, 162, 235, 1)',
						'rgba(255, 206, 86, 1)',
						'rgba(75, 192, 192, 1)',
						'rgba(153, 102, 255, 1)',
						'rgba(255, 159, 64, 1)'
					],
					borderWidth: 1
				}]
			},
			options: {
				scales: {
					yAxes: [{
						ticks: {
							beginAtZero: true,
							fontSize: 15
						}
					}]
				},
				legend: {
					display: false,
					generatedLabels: {
						fontSize: 50
					}
				}
			}
		});
	}
	
}
