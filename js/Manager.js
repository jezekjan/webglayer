function Manager(canvasid) {

	/**
	 * Global variables
	 */
	canvas = document.getElementById(canvasid);
	div = canvas.parentElement;
	gl = canvas.getContext('webgl', {preserveDrawingBuffer: true});

	
	
	this.dimensions = [];
	
	/**
	 * Common databuffers for all dimensions
	 */
	this.databuffers = [];
	this.matrices = [];
	
	this.filters = [];
	
	this.setMapMatrix = function(matrix){
		this.mapMatrix = matrix;		
	}
	
	this.rMatrix = new Float32Array(16);
	this.rMatrix.set([ 0.5, 0, 0, 0, 
	             0, 0.5, 0, 0, 
	             0, 0,    0, 0,
	             0.5, 0.5, 0, 1 ]);
	this.rMatrix.name = "rasterMatrix";
	this.matrices[this.rMatrix.name]= this.rMatrix;

	
	this.addDimension = function(d){
		this.dimensions.push(d);
	}
	
	/**
	 * Creates a data buffer object. itemSize is a dimension of the data
	 */
	this.addDataBuffer = function(data, itemSize, name) {
		var buffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
		gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
		buffer.itemSize = itemSize;
		buffer.numItems = data.length / itemSize;
		buffer.name = name;
		gl.bindBuffer(gl.ARRAY_BUFFER, null);
		this.databuffers[name] = buffer;		
	}
	

	
	/**
	 * traverse all dimensions and renders them
	 */

	this.render = function() {
		/* bind array buffers */
		 
		for (var i = 0; i < this.dimensions.length; i++) {
			d = this.dimensions[i];
			d.setup();
			this.enableBuffersAndCommonUniforms(d.glProgram);
			this.enableFilterTexture(d.glProgram);			
			d.render(this.num_rec);
			d.tearDown();
		}
		
	}
	
	/**
	 * 
	 */
	this.enableBuffersAndCommonUniforms = function(prog) {
		
		/**
		 * Bind matrices
		 */
		for (var i in this.matrices){
			var m = this.matrices[i];
			if (prog[m.name]== null){
				var matrixLoc = this.getUniformLoc(prog, m.name);	
				prog[m.name] = matrixLoc;
			}
		
			gl.uniformMatrix4fv(prog[m.name], false, m);			
		}
		
		this.enableBuffer(prog, "index");
					
	}

	this.bindMapMatrix = function(prog){
	//	gl.useProgram(prog);
		var matrixLoc = this.getUniformLoc(prog, this.mapMatrix.name);		
		gl.uniformMatrix4fv(matrixLoc, false,  this.mapMatrix);		
	}
	
	this.enableBuffer = function(prog, name){
	//	gl.useProgram(prog);
		var buf = this.databuffers[name];
		gl.bindBuffer(gl.ARRAY_BUFFER, buf);

		if (prog[name]==null){
			if (gl.getAttribLocation(prog, buf.name) >= 0) {
				prog[name] = gl.getAttribLocation(prog, buf.name);
			} else {
				console.log("Error: attribute " +  buf.name + " does not exist in program "+prog.name);
			}
		}
				
			gl.enableVertexAttribArray(prog[name]);
			gl.vertexAttribPointer(prog[name], buf.itemSize, gl.FLOAT,
					false, 0, 0);
		
	}
	
	this.enableFilterTexture = function(prog){
	//	gl.useProgram(prog);
		var rasterLoc = this.getUniformLoc(prog, 'filter'); 		 
		gl.uniform1i(rasterLoc , 0);		   
		gl.activeTexture(gl.TEXTURE0);
		gl.bindTexture(gl.TEXTURE_2D, this.filterTexture);
	}
	
	this.getUniformLoc = function(prog, name){
		var loc = gl.getUniformLocation(prog, name)
		if (loc==null){
			console.error("Error setting common uniform "+name+" for program "+ prog.name);
		} else {
			return loc;
		}			
	}
}
