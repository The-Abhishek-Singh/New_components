"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import type { PointerEvent } from "react";
import * as THREE from "three";
import { Model } from "./elements/studio";

type CameraTarget = {
	yaw: number;
	pitch: number;
};

function InteriorCamera({ targetRotation }: { targetRotation: React.MutableRefObject<CameraTarget> }) {
	const { camera } = useThree();
	const currentRotation = useRef({ yaw: 0, pitch: -0.08 });

	useFrame(() => {
		currentRotation.current.yaw = THREE.MathUtils.lerp(
			currentRotation.current.yaw,
			targetRotation.current.yaw,
			0.08,
		);
		currentRotation.current.pitch = THREE.MathUtils.lerp(
			currentRotation.current.pitch,
			targetRotation.current.pitch,
			0.08,
		);

		camera.position.set(0, 1.62, 0);
		camera.rotation.set(
			currentRotation.current.pitch,
			currentRotation.current.yaw,
			0,
			"YXZ",
		);
	});

	return null;
}

function StudioView() {
	const dragStart = useRef({ x: 0, y: 0 });
	const dragging = useRef(false);
	const targetRotation = useRef<CameraTarget>({ yaw: 0, pitch: -0.08 });

	const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
		dragging.current = true;
		dragStart.current = { x: event.clientX, y: event.clientY };
		event.currentTarget.setPointerCapture(event.pointerId);
	};

	const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
		if (!dragging.current) return;

		const deltaX = event.clientX - dragStart.current.x;
		const deltaY = event.clientY - dragStart.current.y;
		dragStart.current = { x: event.clientX, y: event.clientY };

		targetRotation.current.yaw -= deltaX * 0.004;
		targetRotation.current.pitch = THREE.MathUtils.clamp(
			targetRotation.current.pitch - deltaY * 0.003,
			-0.65,
			0.55,
		);
	};

	const stopDragging = (event: PointerEvent<HTMLDivElement>) => {
		dragging.current = false;
		event.currentTarget.releasePointerCapture(event.pointerId);
	};

	return (
		<div
			className="studio-view"
			onPointerDown={handlePointerDown}
			onPointerMove={handlePointerMove}
			onPointerUp={stopDragging}
			onPointerCancel={stopDragging}
		>
			<Canvas
				camera={{ position: [0, 1.62, 0], fov: 72, near: 0.05, far: 100 }}
				dpr={[1, 2]}
				shadows
				gl={{ antialias: true }}
			>
				<color attach="background" args={["#e8dfd1"]} />
				<ambientLight intensity={1.7} />
				<directionalLight castShadow intensity={2.4} position={[2, 5, 2]} />
				<Suspense fallback={null}>
					<Model />
				</Suspense>
				<InteriorCamera targetRotation={targetRotation} />
			</Canvas>
			<div className="studio-view__hint" aria-hidden="true">
				Drag to look around
			</div>
		</div>
	);
}

export default function Hero() {
	return (
		<section className="hero-section h-[95vh]" aria-label="Creative studio ">
			<div className="hero-section__copy">
				<p className="hero-section__eyebrow">Inside the studio</p>
				<h1>Ideas take shape here.</h1>
				<p className="hero-section__body">
					Step into the room and look around. The work is already in progress.
				</p>
			</div>
			<StudioView />
		</section>
	);
}
