exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method not allowed' };
  }

  const apiKey = process.env.MODELSLAB_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Server is missing MODELSLAB_API_KEY. Set it in Netlify > Site configuration > Environment variables.' })
    };
  }

  try {
    const body = JSON.parse(event.body);

    if (body.action === 'poll') {
      const pollRes = await fetch(body.fetchUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: apiKey })
      });
      const data = await pollRes.json();
      return { statusCode: pollRes.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };
    }

    const initRes = await fetch('https://modelslab.com/api/v6/video/img2video', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        key: apiKey,
        init_image: body.init_image,
        prompt: body.prompt,
        model_id: 'wan2.2',
        height: body.height,
        width: body.width,
        num_frames: body.num_frames,
        num_inference_steps: body.num_inference_steps
      })
    });
    const data = await initRes.json();
    return { statusCode: initRes.status, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) };

  } catch (err) {
    return { statusCode: 500, body: JSON.stringify({ error: err.message }) };
  }
};
