import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'annotationsFilter'
})
export class AnnotationsFilterPipe implements PipeTransform {
	
	transform(images: Object[], searchQuery: string): any {
		if(!images || !searchQuery || !searchQuery.length) {
			return images;
		}

		return images.reduce((acc: Object[], image: Object, index: number) => {
			image['index'] = index;
			
			if (image['labelAnnotations'].some((label) => {
				return label['description'].toLowerCase().includes(searchQuery.toLowerCase());
			}))
			{
				return [...acc, image];
			}
			else
			{
				return acc;
			}
		}, []);

		// return images.filter((image) => {
		// 	return image['labelAnnotations'].some((label) => {
		// 		return label['description'].toLowerCase().includes(searchQuery.toLowerCase());
		// 	});
		// });
	}
	
}
