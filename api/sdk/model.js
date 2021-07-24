const tf = require('@tensorflow/tfjs-node');

function normalized(data){ // i & r
    x1 = (data[0] - 430.455) / 1.036649226
    x2 = (data[1] - 298.245) / 9.016004876
    x3 = (data[2] - 950.235) / 8.997745688
    x4 = (data[3] - 321.025) / 1.611433615

    return [x1, x2, x3, x4]
}

function denormalized(data){
    y1 = (data[0] * 398.985) + 8.844903273
    y2 = (data[1] * 698.625) + 118.153034
    y3 = (data[2] * 69.046)  + 6.763930764
    y4 = (data[3] * 47.865)  + 256.434898
    y5 = (data[4] * 49.04)   + 2.238747417
    y6 = (data[5] * 481.715) + 2.759113486

    return [y1, y2, y3, y4, y5, y6]
}


async function predict(data){
    let in_dim = 4;
    
    data = normalized(data);
    shape = [1, in_dim];

    tf_data = tf.tensor2d(data, shape);

    try{
        // path load in public access => github
        const path = 'https://raw.githubusercontent.com/Afaizin-bitt/UAS_JST/main/public/Model5/model.json';
        const model = await tf.loadGraphModel(path);
        
        predict = model.predict(
                tf_data
        );
        result = predict.dataSync();
        return denormalized( result );
        
    }catch(e){
      console.log(e);
    }
}

module.exports = {
    predict: predict 
}
